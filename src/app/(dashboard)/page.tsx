"use client";

export const dynamic = 'force-dynamic';

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  mockDashboardStats,
  mockSalesData,
  mockBestVisited,
  mockRecentPayouts,
} from "@/lib/mock-data/dashboard";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
  const stats = mockDashboardStats;

  const statCards = [
    {
      title: "Toplam Gelir",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: "bg-[#e1eee3]",
      iconColor: "text-[#09724a]",
    },
    {
      title: "Satılan Biletler",
      value: stats.ticketsSold.toLocaleString(),
      change: stats.ticketsChange,
      icon: Ticket,
      color: "bg-[#e8f4fd]",
      iconColor: "text-[#0177fb]",
    },
    {
      title: "İade Tutarı",
      value: formatCurrency(stats.refundedAmount),
      change: stats.refundsChange,
      icon: RefreshCw,
      color: "bg-[#fff0f3]",
      iconColor: "text-[#df1c41]",
    },
    {
      title: "Ödemeler",
      value: stats.payoutsIssued.toLocaleString(),
      change: stats.payoutsChange,
      icon: CreditCard,
      color: "bg-[#fff8e6]",
      iconColor: "text-[#f5a623]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[24px] font-semibold text-[#0d0d12]">Dashboard</h1>
        <p className="text-[14px] text-[#666d80] mt-1">
          Hoş geldiniz! Etkinliklerinizle ilgili son gelişmeler.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;

          return (
            <Card key={stat.title} className="border-[#e5e7eb]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[14px] text-[#666d80] mb-1">
                      {stat.title}
                    </p>
                    <p className="text-[24px] font-semibold text-[#0d0d12]">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-[#09724a]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[#df1c41]" />
                      )}
                      <span
                        className={`text-[12px] font-medium ${
                          isPositive ? "text-[#09724a]" : "text-[#df1c41]"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="text-[12px] text-[#818898] ml-1">
                        geçen aya göre
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
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
        <Card className="lg:col-span-2 border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
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
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d0d12]">
              En Çok Ziyaret Edilen Lokasyonlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBestVisited.map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#0d0d12]">
                      {location.country}
                    </span>
                    <span className="text-[14px] font-semibold text-[#0d0d12]">
                      {formatCurrency(location.amount)}
                    </span>
                  </div>
                  <div className="h-2 bg-[#f7f7f7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#09724a] rounded-full transition-all duration-500"
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
      <Card className="border-[#e5e7eb]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Son Ödemeler
            </CardTitle>
            <button className="text-[14px] text-[#09724a] font-medium hover:underline">
              Tümünü Gör
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Organizatör
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Talep Tarihi
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRecentPayouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-[14px] font-medium text-[#0d0d12]">
                        {payout.organizer}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] font-semibold text-[#0d0d12]">
                        {formatCurrency(payout.amount)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] text-[#666d80]">
                        {payout.contact}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[14px] text-[#666d80]">
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
