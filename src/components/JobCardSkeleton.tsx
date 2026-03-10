import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function JobCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/80 bg-card/90">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-[0.95rem]" />
          <Skeleton className="h-6 w-20 rounded-[0.95rem]" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
