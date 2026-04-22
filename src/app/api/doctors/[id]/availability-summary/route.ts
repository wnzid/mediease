import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  getDoctorAvailabilityService,
  getBookedAppointmentsForDoctorBetweenDatesService,
  generateSlotsFromAvailability,
} from "@/lib/data/supabase";

function datesBetween(start: string, end: string) {
  const out: string[] = [];
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  let cur = new Date(s);
  while (cur.getTime() <= e.getTime()) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export async function GET(req: Request, context: any) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    if (!doctorId) return NextResponse.json({ error: "Missing doctor id." }, { status: 400 });

    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    if (!start || !end) return NextResponse.json({ error: "Missing start or end query params." }, { status: 400 });

    // Fetch availabilities in range and booked appointments in range using service-role client
    let availabilities;
    let booked;
    try {
      availabilities = await getDoctorAvailabilityService(doctorId, start, end);
    } catch (dbErr) {
      console.error("availability-summary: failed to fetch availabilities (service):", dbErr);
      return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
    }

    try {
      booked = await getBookedAppointmentsForDoctorBetweenDatesService(doctorId, start, end);
    } catch (dbErr) {
      console.error("availability-summary: failed to fetch booked appointments (service):", dbErr);
      return NextResponse.json({ error: "Failed to load booked appointments." }, { status: 500 });
    }

    const dates = datesBetween(start, end);

    const summary = dates.map((date) => {
      const availsForDate = (availabilities ?? []).filter((a) => a.availabilityDate === date && a.isActive);
      if (!availsForDate || availsForDate.length === 0) {
        return { date, status: "unavailable", totalSlots: 0, availableSlots: 0 };
      }

      let totalSlots = 0;
      let availableSlots = 0;

      // filter booked appointments for this date
      const bookedForDate = (booked ?? []).filter((b) => (b.startsAt ?? "").slice(0, 10) === date);

      availsForDate.forEach((av) => {
        const slots = generateSlotsFromAvailability(av, bookedForDate);
        totalSlots += slots.length;
        availableSlots += slots.filter((s) => s.isAvailable).length;
      });

      const status = availableSlots > 0 ? "available" : "fullyBooked";
      return { date, status, totalSlots, availableSlots };
    });

    return NextResponse.json({ summary });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/doctors/[id]/availability-summary error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
