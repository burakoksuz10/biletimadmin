// Skeleton Card for Dashboard Loading State
import { Card } from "@/components/ui/card";

export function DashboardStatSkeleton() {
  return (
    <Card variant="stats" padding="md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-3 w-20 bg-surface-low rounded animate-pulse mb-3"></div>
          <div className="h-8 w-24 bg-surface-low rounded animate-pulse"></div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-surface-low animate-pulse"></div>
      </div>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-surface-low rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-surface-low rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-surface-low rounded-full animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStatSkeleton />
        <DashboardStatSkeleton />
        <DashboardStatSkeleton />
        <DashboardStatSkeleton />
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="default" padding="lg">
          <div className="h-6 w-40 bg-surface-low rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-surface-low rounded animate-pulse"></div>
        </Card>
        <Card variant="default" padding="lg">
          <div className="h-6 w-40 bg-surface-low rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-surface-low rounded animate-pulse"></div>
            <div className="h-12 bg-surface-low rounded animate-pulse"></div>
            <div className="h-12 bg-surface-low rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
