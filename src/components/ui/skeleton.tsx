import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-[1.1rem] bg-muted/85", className)} {...props} />;
}

export { Skeleton };
