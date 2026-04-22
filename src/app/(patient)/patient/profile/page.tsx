import { PageHeader } from "@/components/layout/PageHeader";
import { PatientProfileForm } from "@/features/patient/profile/PatientProfileForm";

export default function PatientProfilePage() {
  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage personal details, emergency contact information, and core care context."
      />
      <PatientProfileForm />
    </>
  );
}
