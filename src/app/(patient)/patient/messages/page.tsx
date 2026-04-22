import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PatientMessagesPage() {
  return (
    <>
      <PageHeader
        title="Messages"
        description="A placeholder conversation area for future secure patient-clinician messaging."
      />
      <EmptyState
        icon="chat"
        title="Messaging is staged for a future release"
        description="The page structure is ready for thread lists, care team replies, and secure messaging integration."
      />
    </>
  );
}
