import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-10 md:px-6">
      <Skeleton className="h-16 w-48" />
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
