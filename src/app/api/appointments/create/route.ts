import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getDoctorAvailabilityService, getBookedAppointmentsForDoctorAndDateService, generateSlotsFromAvailability } from "@/lib/data/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      doctorId,
      appointmentType,
      mode,
      reason,
      availabilityId,
      date,
      startsAt,
      guestFullName,
      guestEmail,
      guestPhone,
    } = body ?? {};

    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    if (!doctorId || !appointmentType || !mode || !date || !startsAt) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Load availabilities and booked appointments for the date using service-role helpers
    let availabilities;
    try {
      availabilities = await getDoctorAvailabilityService(doctorId, date, date);
    } catch (dbErr) {
      console.error("appointments/create: failed to fetch availability (service):", dbErr);
      return NextResponse.json({ error: "Failed to validate availability." }, { status: 500 });
    }

    const activeAvail = (availabilities ?? []).filter((a) => a.isActive);
    if (!activeAvail || activeAvail.length === 0) return NextResponse.json({ error: "No availability for selected date." }, { status: 400 });

    let booked;
    try {
      booked = await getBookedAppointmentsForDoctorAndDateService(doctorId, date);
    } catch (dbErr) {
      console.error("appointments/create: failed to fetch booked appointments (service):", dbErr);
      return NextResponse.json({ error: "Failed to validate bookings." }, { status: 500 });
    }

    // Generate slots across all active availabilities and validate requested slot
    const allSlots = activeAvail.flatMap((a) => generateSlotsFromAvailability(a, booked).map((s) => ({ ...s, availability: a })));
    const requestedStartIso = new Date(startsAt).toISOString();
    const matched = allSlots.find((s) => new Date(s.startAt).toISOString() === requestedStartIso);
    if (!matched || !matched.isAvailable) return NextResponse.json({ error: "Selected slot is no longer available." }, { status: 409 });

    // Derive current logged-in profile (if any). Be robust: the auth user id may not equal profiles.id.
    const serverSupabase = await createServerSupabaseClient();
    let loggedProfileId: string | null = null;
    let sessionUserEmail: string | null = null;
    if (serverSupabase) {
      try {
        const { data: authData } = await serverSupabase.auth.getUser();
        const uid = authData?.user?.id ?? null;
        sessionUserEmail = authData?.user?.email ?? null;

        if (uid) {
          // 1) Try profiles.id == uid
          const byId = await serverSupabase.from("profiles").select("id").eq("id", uid).maybeSingle();
          if (byId?.data?.id) {
            loggedProfileId = byId.data.id;
          } else {
            // 2) Try profiles.auth_user_id == uid
            const byAuth = await serverSupabase.from("profiles").select("id").eq("auth_user_id", uid).maybeSingle();
            if (byAuth?.data?.id) loggedProfileId = byAuth.data.id;
            else if (sessionUserEmail) {
              // 3) Fallback: match by email
              const byEmail = await serverSupabase.from("profiles").select("id").eq("email", sessionUserEmail).maybeSingle();
              if (byEmail?.data?.id) loggedProfileId = byEmail.data.id;
            }
          }
        } else if (sessionUserEmail) {
          // No uid available but we have an email
          const byEmail = await serverSupabase.from("profiles").select("id").eq("email", sessionUserEmail).maybeSingle();
          if (byEmail?.data?.id) loggedProfileId = byEmail.data.id;
        }
      } catch (e) {
        // best-effort: if resolution fails, continue as guest
        console.warn("appointments/create: profile resolution failed", e);
      }
    }

    // Determine patient id: prefer logged-in patient_profiles.id, otherwise create/lookup guest profile and patient_profiles
    const service = createServiceSupabaseClient();
    if (!service) return NextResponse.json({ error: "Supabase admin client unavailable." }, { status: 500 });

    let patientId: string | null = null;

    // helper validators
    const emailPattern = (v: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? ""));
    const normalizePhone = (v: any) => {
      const s = String(v ?? "").trim();
      if (!s) return null;
      return s;
    };

    try {
      if (loggedProfileId) {
        // ensure patient_profiles exists for logged-in profile
        const { data: existingPP, error: ppErr } = await service.from("patient_profiles").select("id").eq("id", loggedProfileId).maybeSingle();
        if (ppErr) {
          console.error("patient_profiles lookup error for logged user:", ppErr);
          return NextResponse.json({ error: "Failed to validate patient profile." }, { status: 500 });
        }

        if (!existingPP) {
          const { data: createdPP, error: createPPErr } = await service.from("patient_profiles").insert({ id: loggedProfileId }).select("id").maybeSingle();
          if (createPPErr) {
            console.error("patient_profiles create error for logged user:", createPPErr);
            return NextResponse.json({ error: "Failed to create patient profile." }, { status: 500 });
          }
          // log creation
          console.log("Created patient_profiles row for logged user", createdPP?.id ?? loggedProfileId);
        }

        // optionally update phone if provided
        const phoneNorm = normalizePhone(guestPhone);
        if (phoneNorm) {
          await service.from("patient_profiles").update({ phone: phoneNorm }).eq("id", loggedProfileId);
        }

        patientId = loggedProfileId;
      } else {
        // Guest booking: require full name and email
        if (!guestFullName || !String(guestFullName).trim() || !guestEmail || !emailPattern(guestEmail)) {
          return NextResponse.json({ error: "Missing required guest fields (full name and valid email)." }, { status: 400 });
        }

        const fullName = String(guestFullName).trim();
        const email = String(guestEmail).trim().toLowerCase();
        const phoneNorm = normalizePhone(guestPhone);

        console.log("Guest booking: lookup profile by email", email);

        // Look for an existing profile with this email
        const { data: existingProfile, error: selectProfileErr } = await service.from("profiles").select("id, full_name, email").eq("email", email).maybeSingle();
        if (selectProfileErr) {
          console.error("profiles lookup error for guest:", selectProfileErr);
          return NextResponse.json({ error: "Failed to lookup profile." }, { status: 500 });
        }

        let profileId: string | null = null;

        if (existingProfile && existingProfile.id) {
          profileId = existingProfile.id;
          console.log("Found existing profile for guest email", profileId);

          // If profile lacks a full name but guest provided one, update it (best-effort)
          if ((!existingProfile.full_name || String(existingProfile.full_name).trim() === "") && fullName) {
            try {
              await service.from("profiles").update({ full_name: fullName }).eq("id", profileId);
            } catch (e) {
              // non-fatal
              console.warn("Failed to update profile full_name for", profileId, e);
            }
          }
        } else {
          // No profile row found. Try to detect if an auth user exists with this email so we can create a canonical profile using that id.
          let authUserId: string | null = null;
          try {
            // List users (best-effort). This may need pagination in very large installations.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const usersRes = await service.auth.admin.listUsers({ perPage: 100, page: 1 });
            const users = (usersRes?.data?.users ?? []) as any[];
            const match = users.find((u) => ((u?.email ?? "").toLowerCase() === email));
            if (match) authUserId = match.id;
          } catch (e) {
            // ignore - we'll create a normal profile row
          }

          const toInsert: any = { email, full_name: fullName, role: "patient", auth_user_id: authUserId ?? null };
          if (authUserId) toInsert.id = authUserId;

          const { data: createdProfile, error: createProfileErr } = await service.from("profiles").insert(toInsert).select("id").maybeSingle();
          if (createProfileErr) {
            console.error("profiles create error for guest:", createProfileErr);
            return NextResponse.json({ error: "Failed to create profile." }, { status: 500 });
          }
          profileId = createdProfile?.id ?? null;
          console.log("Created profile for guest", profileId);
        }

        if (!profileId) {
          return NextResponse.json({ error: "Unable to determine guest profile id." }, { status: 500 });
        }

        // ensure patient_profiles exists for this profile id
        const { data: existingPP, error: ppErr2 } = await service.from("patient_profiles").select("id").eq("id", profileId).maybeSingle();
        if (ppErr2) {
          console.error("patient_profiles lookup error for guest:", ppErr2);
          return NextResponse.json({ error: "Failed to validate patient profile." }, { status: 500 });
        }

        if (!existingPP) {
          const insertRow: any = { id: profileId };
          if (phoneNorm) insertRow.phone = phoneNorm;
          const { data: createdPP, error: createPPErr2 } = await service.from("patient_profiles").insert(insertRow).select("id").maybeSingle();
          if (createPPErr2) {
            console.error("patient_profiles create error for guest:", createPPErr2);
            return NextResponse.json({ error: "Failed to create patient profile." }, { status: 500 });
          }
          console.log("Created patient_profiles for guest", createdPP?.id ?? profileId);
        } else {
          // update phone if provided
          if (phoneNorm) {
            await service.from("patient_profiles").update({ phone: phoneNorm }).eq("id", profileId);
          }
        }

        patientId = profileId;
      }
    } catch (err) {
      console.error("Error ensuring patient identity:", err);
      return NextResponse.json({ error: "Failed to prepare patient identity." }, { status: 500 });
    }

    if (!patientId) return NextResponse.json({ error: "Unable to determine patient identity." }, { status: 500 });

    // Final conflict check: ensure no appointment exists for same doctor + starts_at with pending/confirmed
    const conflictCheck = await service
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("starts_at", requestedStartIso)
      .in("status", ["pending", "confirmed"]);

    if ((conflictCheck.data ?? []).length > 0) return NextResponse.json({ error: "Slot already taken." }, { status: 409 });

    // Compute endsAt from slot duration
    // Use matched slot end time to compute endsAt
    const endsAt = matched.endAt ?? new Date(new Date(requestedStartIso).getTime() + (matched.availability?.slotDurationMinutes ?? 30) * 60 * 1000).toISOString();

    // derive clinic from doctor's profile if available
    const { data: doctorProfile } = await service.from("doctor_profiles").select("clinic_id").eq("id", doctorId).maybeSingle();
    const clinicIdFromDoctor = doctorProfile?.clinic_id ?? null;

    // Generate a human-friendly booking reference (e.g., MED-20260422-3812)
    function generateReference(startsAtIso: string) {
      try {
        const d = new Date(startsAtIso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const datePart = `${y}${m}${day}`;
        const suffix = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        return `MED-${datePart}-${suffix}`;
      } catch (e) {
        return `MED-${Date.now() % 100000}`;
      }
    }

    const generatedReference = generateReference(requestedStartIso);

    // Determine whether the appointments table has a 'reference' column we can write to.
    let supportsReferenceColumn = false;
    try {
      const { error: refErr } = await service.from("appointments").select("reference").limit(1);
      if (!refErr) supportsReferenceColumn = true;
    } catch (e) {
      supportsReferenceColumn = false;
    }

    const apptRow: any = {
      patient_id: patientId,
      doctor_id: doctorId,
      clinic_id: clinicIdFromDoctor,
      availability_id: matched.availability?.id ?? null,
      booked_by_profile_id: loggedProfileId ?? null,
      status: "pending",
      appointment_type: appointmentType,
      mode,
      reason: reason ?? "",
      // include reference if supported by DB schema
      ...(supportsReferenceColumn ? { reference: generatedReference } : {}),
      starts_at: requestedStartIso,
      ends_at: endsAt,
    };
    // Insert appointment. Select list must be conditional on reference column presence to avoid DB errors.
    const appointmentSelect = supportsReferenceColumn
      ? "id, patient_id, doctor_id, clinic_id, appointment_type, mode, starts_at, ends_at, status, reason, reference"
      : "id, patient_id, doctor_id, clinic_id, appointment_type, mode, starts_at, ends_at, status, reason";

    let apptData: any = null;
    try {
      const { data, error } = await service.from("appointments").insert(apptRow).select(appointmentSelect).maybeSingle();
      if (error || !data) {
        console.error("appointment insert error", error);
        return NextResponse.json({ error: "Failed to create appointment." }, { status: 500 });
      }
      apptData = data;
    } catch (err) {
      console.error("appointment insert exception", err);
      return NextResponse.json({ error: "Failed to create appointment." }, { status: 500 });
    }

    // Fetch patient details (profiles + patient_profiles) for summary
    let patientProfile: any = null;
    try {
      const { data: p } = await service.from("profiles").select("id, full_name, email").eq("id", apptData.patient_id).maybeSingle();
      patientProfile = p ?? null;
    } catch (e) {
      /* best-effort */
    }

    let patientContact: any = null;
    try {
      const { data: pp } = await service.from("patient_profiles").select("id, phone").eq("id", apptData.patient_id).maybeSingle();
      patientContact = pp ?? null;
    } catch (e) {
      /* best-effort */
    }

    // Fetch doctor name
    let doctorProfileName: any = null;
    try {
      const { data: d } = await service.from("profiles").select("id, full_name").eq("id", apptData.doctor_id).maybeSingle();
      doctorProfileName = d ?? null;
    } catch (e) {
      /* best-effort */
    }

    // Fetch clinic details if available
    let clinicRow: any = null;
    try {
      if (apptData.clinic_id) {
        const { data: c } = await service.from("clinics").select("id, name, location").eq("id", apptData.clinic_id).maybeSingle();
        clinicRow = c ?? null;
      }
    } catch (e) {
      /* best-effort */
    }

    const appointmentSummary = {
      id: apptData.id,
      reference: apptData.reference ?? generatedReference,
      appointmentType: apptData.appointment_type,
      mode: apptData.mode,
      reason: apptData.reason ?? null,
      startsAt: apptData.starts_at,
      endsAt: apptData.ends_at,
      status: apptData.status,
      patient: {
        id: patientProfile?.id ?? apptData.patient_id,
        fullName: patientProfile?.full_name ?? null,
        email: patientProfile?.email ?? null,
        phone: patientContact?.phone ?? null,
      },
      doctor: {
        id: apptData.doctor_id,
        fullName: doctorProfileName?.full_name ?? null,
      },
      clinic: clinicRow ? { id: clinicRow.id, name: clinicRow.name ?? null, address: clinicRow.location ?? null } : null,
    };

    return NextResponse.json({ success: true, appointment: appointmentSummary });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/appointments/create error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
