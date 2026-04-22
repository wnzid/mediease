import { PageHeader } from "@/components/layout/PageHeader";
import { DoctorProfileForm } from "@/features/doctor/profile/DoctorProfileForm";

export default function DoctorProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Keep your specialties, bio, languages, and clinic associations current."
      />
      <DoctorProfileForm />
    </>
  );
}
