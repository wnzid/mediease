import DoctorDetailContent from "@/components/doctors/DoctorDetailContent";

export default async function PublicDoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <DoctorDetailContent params={params} isPatient={false} />;
}
