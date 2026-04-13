"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Ticket,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { mockSalesData } from "@/lib/mock-data/dashboard";

const monthlyTicketData = [
  { month: "Jan", sold: 1200, refunded: 50 },
  { month: "Feb", sold: 2100, refunded: 80 },
  { month: "Mar", sold: 1800, refunded: 45 },
  { month: "Apr", sold: 2800, refunded: 90 },
  { month: "May", sold: 2200, refunded: 60 },
  { month: "Jun", sold: 3200, refunded: 110 },
  { month: "Jul", sold: 2700, refunded: 75 },
  { month: "Aug", sold: 3800, refunded: 120 },
  { month: "Sep", sold: 3100, refunded: 85 },
  { month: "Oct", sold: 3500, refunded: 95 },
  { month: "Nov", sold: 4000, refunded: 130 },
  { month: "Dec", sold: 4500, refunded: 150 },
];

const categoryData = [
  { name: "Müzik", value: 35, color: "#00c853" },
  { name: "Teknoloji", value: 25, color: "#42a5f5" },
  { name: "Sanat", value: 18, color: "#ffa726" },
  { name: "Spor", value: 12, color: "#ef5350" },
  { name: "Diğer", value: 10, color: "#494454" },
];

const userGrowthData = [
  { month: "Jan", users: 150 },
  { month: "Feb", users: 280 },
  { month: "Mar", users: 420 },
  { month: "Apr", users: 590 },
  { month: "May", users: 780 },
  { month: "Jun", users: 950 },
  { month: "Jul", users: 1100 },
  { month: "Aug", users: 1380 },
  { month: "Sep", users: 1520 },
  { month: "Oct", users: 1750 },
  { month: "Nov", users: 1920 },
  { month: "Dec", users: 2100 },
];

const topEvents = [
  { name: "Artistic Odyssey", tickets: 758, revenue: 27450 },
  { name: "Imagination Expo", tickets: 874, revenue: 71840 },
  { name: "Spectrum Showcase", tickets: 541, revenue: 48230 },
  { name: "Innovators' Gala", tickets: 487, revenue: 15970 },
  { name: "Elysium Festival", tickets: 265, revenue: 56470 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("yearly");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Raporlar
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Platformunuz için kapsamlı analizler ve raporlar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface-low rounded-xl p-1">
            {(["weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg body-sm font-medium transition-colors ${
                  dateRange === range
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low/80"
                }`}
              >
                {range === "weekly" ? "Haftalık" : range === "monthly" ? "Aylık" : "Yıllık"}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="medium">
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Gelir</p>
              <p className="display-lg text-on-surface leading-none">
                {formatCurrency(985000)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <DollarSign className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Satılan Biletler</p>
              <p className="display-lg text-on-surface leading-none">
                30,000
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Ticket className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Kullanıcı</p>
              <p className="display-lg text-on-surface leading-none">
                2,100
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7 text-info" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Etkinlik</p>
              <p className="display-lg text-on-surface leading-none">
                156
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center shadow-sm">
              <FileText className="w-7 h-7 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue & Ticket Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Chart */}
        <Card variant="default">
          <CardHeader className="pb-4">
            <CardTitle className="title-lg font-semibold text-on-surface">
              Gelir Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b38d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6b38d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 195, 215, 0.3)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(203, 195, 215, 0.3)",
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    "Gelir",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#6b38d4"
                  strokeWidth={2}
                  fill="url(#colorRevenueReport)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Sales Chart */}
        <Card variant="default">
          <CardHeader className="pb-4">
            <CardTitle className="title-lg font-semibold text-on-surface">
              Bilet Satışları vs İadeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTicketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 195, 215, 0.3)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(203, 195, 215, 0.3)",
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sold"
                  name="Satılan"
                  fill="#00c853"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="refunded"
                  name="İade Edilen"
                  fill="#ef5350"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Event Categories */}
        <Card variant="default">
          <CardHeader className="pb-4">
            <CardTitle className="title-lg font-semibold text-on-surface">
              Etkinlik Kategorileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(203, 195, 215, 0.3)",
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                  }}
                  formatter={(value) => [`${value}%`, "Oran"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="label-md text-on-surface-variant">
                    {cat.name} ({cat.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card variant="default" className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="title-lg font-semibold text-on-surface">
              Kullanıcı Artışı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#42a5f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 195, 215, 0.3)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#494454", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(203, 195, 215, 0.3)",
                    borderRadius: "12px",
                    backdropFilter: "blur(20px)",
                  }}
                  formatter={(value) => [Number(value).toLocaleString(), "Kullanıcı"]}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#42a5f5"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <Card variant="default">
        <CardHeader className="pb-4">
          <CardTitle className="title-lg font-semibold text-on-surface">
            En Çok Performans Gösteren Etkinlikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline/30 bg-surface-low/50">
                  <th className="text-left py-4 px-6 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left py-4 px-6 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                    Etkinlik Adı
                  </th>
                  <th className="text-left py-4 px-6 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                    Satılan Biletler
                  </th>
                  <th className="text-left py-4 px-6 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                    Gelir
                  </th>
                </tr>
              </thead>
              <tbody>
                {topEvents.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-outline/30 last:border-0 hover:bg-surface-low/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center body-sm font-semibold text-success">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6 body-md font-medium text-on-surface">
                      {event.name}
                    </td>
                    <td className="py-4 px-6 body-md text-on-surface-variant">
                      {event.tickets.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 body-md font-semibold text-on-surface">
                      {formatCurrency(event.revenue)}
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
