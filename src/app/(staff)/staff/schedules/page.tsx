import { PageHeader } from "@/components/layout/PageHeader";
import { AvailabilityEditor } from "@/components/forms/AvailabilityEditor";

export default function StaffSchedulesPage() {
  return (
    <>
      <PageHeader
        title="Doctor schedules"
        description="Coordinate provider availability, break slots, and visit mode coverage across the clinic."
      />
      <AvailabilityEditor />
    </>
  );
}
