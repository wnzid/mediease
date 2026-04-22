import DoctorDetailContent from "@/components/doctors/DoctorDetailContent";

export default async function PatientDoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DoctorDetailContent params={params} isPatient={true} />;
}
