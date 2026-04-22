import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PatientDocumentsPage() {
  return (
    <>
      <PageHeader
        title="Documents"
        description="A placeholder area for reports, uploads, visit summaries, and future storage-backed records."
      />
      <EmptyState
        icon="folder_open"
        title="Documents are ready for future integration"
        description="Supabase Storage or a clinical document provider can be added here when document workflows are in scope."
      />
    </>
  );
}
