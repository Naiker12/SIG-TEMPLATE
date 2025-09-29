
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SidebarSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full flex-col p-4", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>

      <div className="mt-8 flex flex-col gap-2">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>

      <div className="mt-auto flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-3 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
