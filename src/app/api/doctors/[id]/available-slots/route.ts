import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getDoctorAvailabilityService, getBookedAppointmentsForDoctorAndDateService, generateSlotsFromAvailability } from "@/lib/data/supabase";

export async function GET(req: Request, context: any) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    if (!date) return NextResponse.json({ error: "Missing date query param." }, { status: 400 });

    // Fetch active availability rows for the doctor on the date using service-role client
    let availabilities;
    try {
      availabilities = await getDoctorAvailabilityService(doctorId, date, date);
    } catch (dbErr) {
      console.error("available-slots: failed to fetch availabilities (service):", dbErr);
      return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
    }
    const active = (availabilities ?? []).filter((a) => a.isActive);

    if (active.length === 0) return NextResponse.json({ slots: [], availability: [] });

    // Fetch booked appointments once for the doctor/date using service-role client
    let booked;
    try {
      booked = await getBookedAppointmentsForDoctorAndDateService(doctorId, date);
    } catch (dbErr) {
      console.error("available-slots: failed to fetch booked appointments (service):", dbErr);
      return NextResponse.json({ error: "Failed to load booked appointments." }, { status: 500 });
    }

    const result = active.map((a) => ({ availability: a, slots: generateSlotsFromAvailability(a, booked) }));

    // Flatten slots for convenience
    const slots = result.flatMap((r) => r.slots.map((s) => ({ ...s, availabilityId: r.availability.id })));

    return NextResponse.json({ availability: result, slots });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/doctors/[id]/available-slots error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
