import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-surface-2 border border-border/40">
      <Skeleton className="aspect-video w-full bg-surface-3" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full bg-surface-3" />
        <Skeleton className="h-4 w-3/4 bg-surface-3" />
        <Skeleton className="h-3 w-full bg-surface-3" />
        <Skeleton className="h-3 w-5/6 bg-surface-3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-5 w-20 bg-surface-3" />
          <Skeleton className="h-5 w-16 bg-surface-3" />
        </div>
      </div>
    </div>
  );
}
