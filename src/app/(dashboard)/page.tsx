"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  RefreshCw,
  CreditCard,
  Calendar,
  MapPin,
  Users,
  Building2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { dashboardService } from "@/lib/api/services";
import type { SalesDataPoint, BestVisitedLocation, RecentPayout } from "@/types/dashboard.types";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for features not yet available in API
const mockSalesData: SalesDataPoint[] = [
  { month: "Oca", income: 20000 },
  { month: "Şub", income: 45000 },
  { month: "Mar", income: 30000 },
  { month: "Nis", income: 55000 },
  { month: "May", income: 40000 },
  { month: "Haz", income: 65000 },
];

const mockBestVisited: BestVisitedLocation[] = [
  { country: "İstanbul, Türkiye", amount: 32580, percentage: 34 },
  { country: "Antalya, Türkiye", amount: 24890, percentage: 26 },
  { country: "Ankara, Türkiye", amount: 18756, percentage: 20 },
  { country: "İzmir, Türkiye", amount: 12340, percentage: 13 },
  { country: "Bursa, Türkiye", amount: 6780, percentage: 7 },
];

const mockRecentPayouts: RecentPayout[] = [
  {
    id: "pay-001",
    organizer: "Ahmet Yılmaz",
    amount: 25000,
    contact: "+905321234567",
    requestedOn: "2025-01-15",
    status: "pending",
  },
  {
    id: "pay-002",
    organizer: "Ayşe Demir",
    amount: 15000,
    contact: "+905321234568",
    requestedOn: "2025-01-14",
    status: "approved",
    processedOn: "2025-01-15",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    activeEvents: 0,
    totalEvents: 0,
    venuesCount: 0,
    usersCount: 0,
    customersCount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

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
    }
  };

  const statCards = [
    {
      title: "Toplam Gelir",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-[#e1eee3]",
      iconColor: "text-[#09724a]",
    },
    {
      title: "Aktif Etkinlikler",
      value: `${stats.activeEvents}/${stats.totalEvents}`,
      subtitle: `${stats.totalEvents} toplam`,
      icon: Calendar,
      color: "bg-[#e8f4fd]",
      iconColor: "text-[#0177fb]",
    },
    {
      title: "Müşteriler",
      value: stats.customersCount.toLocaleString(),
      icon: Users,
      color: "bg-[#f3e8fd]",
      iconColor: "text-[#9333ea]",
    },
    {
      title: "Mekanlar",
      value: stats.venuesCount.toLocaleString(),
      icon: MapPin,
      color: "bg-[#fff8e6]",
      iconColor: "text-[#f59e0b]",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#09724a]" />
          <p className="text-[#666d80]">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">Dashboard</h1>
          <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af] mt-1">
            Etkinliklerinizle ilgili son gelişmeler.
          </p>
        </div>
        {error && (
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#09724a] bg-[#e1eee3] rounded-lg hover:bg-[#c8e0ca] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Yenile
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
          <p className="text-[#dc2626] text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af] mb-1">
                      {stat.title}
                    </p>
                    <p className="text-[24px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-[12px] text-[#818898] dark:text-[#6b7280] mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} dark:bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
              Satış Özeti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#09724a"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#09724a"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                  tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Gelir",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#09724a"
                  strokeWidth={2}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Best Visited Locations */}
        <Card className="border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
              En Çok Satış Yapılan Şehirler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBestVisited.map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#0d0d12] dark:text-[#f9fafb]">
                      {location.country}
                    </span>
                    <span className="text-[14px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                      {formatCurrency(location.amount)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f7f7f7] dark:bg-[#374151] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#09724a] dark:bg-[#00fb90] rounded-full transition-all duration-500"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payouts Table */}
      <Card className="border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
              Son Ödemeler
            </CardTitle>
            <button className="text-[14px] text-[#09724a] dark:text-[#00fb90] font-medium hover:underline">
              Tümünü Gör
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#374151]">
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] dark:text-[#9ca3af] uppercase tracking-wider">
                    Organizatör
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] dark:text-[#9ca3af] uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] dark:text-[#9ca3af] uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] dark:text-[#9ca3af] uppercase tracking-wider">
                    Talep Tarihi
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] dark:text-[#9ca3af] uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRecentPayouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-[#e5e7eb] dark:border-[#374151] hover:bg-[#f7f7f7] dark:hover:bg-[#374151] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                        {payout.organizer}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] font-semibold text-[#0d0d12] dark:text-[#f9fafb]">
                        {formatCurrency(payout.amount)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">
                        {payout.contact}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">
                        {formatDate(payout.requestedOn)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          payout.status === "approved" ? "success" : "warning"
                        }
                      >
                        {payout.status === "approved" ? "Onaylandı" : "Beklemede"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
