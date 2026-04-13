"use client";

import { useState, useEffect, useCallback, useMemo, memo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  RefreshCw,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-card";
import type { SalesDataPoint, BestVisitedLocation, RecentPayout } from "@/types/dashboard.types";

// Dynamic import for chart components (code splitting, no SSR)
const ChartComponents = dynamic(
  () => import("@/components/dashboard/revenue-chart").then(mod => ({ default: mod.RevenueChart })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center bg-surface-low rounded-xl animate-pulse" />
    ),
  }
);

// Memoized Stat Card Component
const StatCard = memo(function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  return (
    <Card variant="stats" padding="md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">
            {title}
          </p>
          <p className="display-lg text-on-surface leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="body-sm text-on-surface-variant mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
});

// Memoized Location Item Component
const LocationItem = memo(function LocationItem({
  location,
}: {
  location: BestVisitedLocation;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="body-md text-on-surface">{location.country}</p>
          <p className="body-sm text-on-surface-variant">
            ${location.amount.toLocaleString()}
          </p>
        </div>
      </div>
      <Badge variant="success">{location.percentage}%</Badge>
    </div>
  );
});

// Memoized Payout Item Component
const PayoutItem = memo(function PayoutItem({
  payout,
}: {
  payout: RecentPayout;
}) {
  const statusLabel = payout.status === "approved" ? "Onaylandı" : "Bekliyor";
  const badgeVariant = payout.status === "approved" ? "success" : "warning" as const;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-low/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-primary text-on-primary flex items-center justify-center font-semibold text-sm">
          {payout.organizer.charAt(0)}
        </div>
        <div>
          <p className="body-md text-on-surface font-medium">{payout.organizer}</p>
          <p className="body-sm text-on-surface-variant">
            ${payout.amount.toLocaleString()} • {new Date(payout.requestedOn).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>
      <Badge variant={badgeVariant}>
        {statusLabel}
      </Badge>
    </div>
  );
});

// Inline components to avoid module loading overhead
const BestVisitedLocations = memo(function BestVisitedLocations({
  locations,
}: {
  locations: BestVisitedLocation[];
}) {
  return (
    <Card variant="default" padding="lg">
      <CardHeader>
        <CardTitle>En Çok Ziyaret Edilen Mekanlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {locations.map((location, index) => (
            <LocationItem key={`${location.country}-${index}`} location={location} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

const RecentPayouts = memo(function RecentPayouts({
  payouts,
}: {
  payouts: RecentPayout[];
}) {
  return (
    <Card variant="default" padding="lg">
      <CardHeader>
        <CardTitle>Son Ödemeler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payouts.map((payout) => (
            <PayoutItem key={payout.id} payout={payout} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Mock data - frozen to prevent mutations
const MOCK_SALES_DATA = Object.freeze([
  { month: "Oca", income: 20000 },
  { month: "Şub", income: 45000 },
  { month: "Mar", income: 30000 },
  { month: "Nis", income: 55000 },
  { month: "May", income: 40000 },
  { month: "Haz", income: 65000 },
] as const);

const MOCK_BEST_VISITED = Object.freeze([
  { country: "İstanbul, Türkiye", amount: 32580, percentage: 34 },
  { country: "Antalya, Türkiye", amount: 24890, percentage: 26 },
  { country: "Ankara, Türkiye", amount: 18756, percentage: 20 },
  { country: "İzmir, Türkiye", amount: 12340, percentage: 13 },
  { country: "Bursa, Türkiye", amount: 6780, percentage: 7 },
] as const);

const MOCK_RECENT_PAYOUTS = Object.freeze([
  {
    id: "pay-001",
    organizer: "Ahmet Yılmaz",
    amount: 25000,
    contact: "+905321234567",
    requestedOn: "2025-01-15",
    status: "pending" as const,
  },
  {
    id: "pay-002",
    organizer: "Ayşe Demir",
    amount: 15000,
    contact: "+905321234568",
    requestedOn: "2025-01-14",
    status: "approved" as const,
    processedOn: "2025-01-15",
  },
] as const);

// Simple formatter functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    activeEvents: 0,
    totalEvents: 0,
    venuesCount: 0,
    usersCount: 0,
    customersCount: 0,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable stat cards configuration
  const statCards = useMemo(
    () => [
      {
        title: "Toplam Gelir",
        value: formatCurrency(stats.totalRevenue),
        icon: DollarSign,
        iconColor: "text-primary",
      },
      {
        title: "Aktif Etkinlikler",
        value: `${stats.activeEvents}/${stats.totalEvents}`,
        subtitle: `${stats.totalEvents} toplam`,
        icon: Calendar,
        iconColor: "text-info",
      },
      {
        title: "Etkinlikler",
        value: stats.totalEvents.toString(),
        subtitle: "Toplam kayıtlı",
        icon: MapPin,
        iconColor: "text-warning",
      },
      {
        title: "Kullanıcılar",
        value: stats.usersCount.toString(),
        subtitle: "Kayıtlı kullanıcı",
        icon: Users,
        iconColor: "text-secondary",
      },
    ],
    [stats.totalRevenue, stats.activeEvents, stats.totalEvents, stats.usersCount]
  );

  const loadDashboardData = useCallback((showLoading = false) => {
    // Use transition for non-urgent updates
    startTransition(async () => {
      try {
        if (showLoading) setLoading(true);
        setError(null);

        // Dynamic import the service only when needed
        const { dashboardService } = await import("@/lib/api/services");
        const data = await dashboardService.getDashboardData();

        setStats({
          totalRevenue: data.stats.totalRevenue,
          ticketsSold: data.stats.ticketsSold,
          activeEvents: data.eventsCount.active,
          totalEvents: data.eventsCount.total,
          venuesCount: data.venuesCount,
          usersCount: data.usersCount,
          customersCount: data.customersCount,
        });
      } catch (err: any) {
        console.error("Dashboard yüklenirken hata:", err);
        setError(err?.message || "Veriler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    });
  }, []);

  useEffect(() => {
    // Load data immediately but show skeleton first
    const timer = setTimeout(() => {
      loadDashboardData(false);
    }, 100); // Small delay to let skeleton render first

    return () => clearTimeout(timer);
  }, [loadDashboardData]);

  // Show skeleton on initial load
  if (isInitialLoad) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Dashboard
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Genel bakış ve istatistikler
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(loading || isPending) && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          <button
            onClick={() => loadDashboardData(true)}
            disabled={loading || isPending}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white/30 dark:bg-white/10 text-primary backdrop-blur-glass border border-white/20 hover:bg-white/40 dark:hover:bg-white/15 active:scale-[0.98] h-9 px-4 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || isPending) ? "animate-spin" : ""}`} />
            Yenile
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card variant="default" padding="md">
          <CardContent className="p-6">
            <p className="body-md text-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart - dynamically loaded */}
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>Gelir Grafiği</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponents data={MOCK_SALES_DATA} />
          </CardContent>
        </Card>

        {/* Best Visited Locations */}
        <BestVisitedLocations locations={MOCK_BEST_VISITED} />
      </div>

      {/* Recent Payouts */}
      <RecentPayouts payouts={MOCK_RECENT_PAYOUTS} />
    </div>
  );
}
