import { PageHeader } from "@/components/layout/PageHeader";
import { AvailabilityEditor } from "@/components/forms/AvailabilityEditor";

export default function DoctorAvailabilityPage() {
  return (
    <>
      <PageHeader
        title="Availability"
        description="Manage working hours, appointment modes, and break coverage for your schedule."
      />
      <AvailabilityEditor />
    </>
  );
}
