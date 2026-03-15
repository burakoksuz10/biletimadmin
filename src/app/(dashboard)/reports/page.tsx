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
  { name: "Müzik", value: 35, color: "#09724a" },
  { name: "Teknoloji", value: 25, color: "#0177fb" },
  { name: "Sanat", value: 18, color: "#d39c3d" },
  { name: "Spor", value: 12, color: "#df1c41" },
  { name: "Diğer", value: 10, color: "#818898" },
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
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">Raporlar</h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Platformunuz için kapsamlı analizler ve raporlar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#f7f7f7] rounded-lg p-1">
            {(["weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-[14px] font-medium transition-colors ${
                  dateRange === range
                    ? "bg-white text-[#0d0d12] shadow-sm"
                    : "text-[#666d80] hover:text-[#0d0d12]"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Gelir</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {formatCurrency(985000)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8f4fd] flex items-center justify-center">
                <Ticket className="w-6 h-6 text-[#0177fb]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Satılan Biletler</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  30,000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#d39c3d]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Kullanıcı</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  2,100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f3] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#df1c41]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Etkinlik</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  156
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Ticket Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Gelir Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#09724a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#09724a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                  fill="url(#colorRevenueReport)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ticket Sales Chart */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Bilet Satışları vs İadeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTicketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sold"
                  name="Satılan"
                  fill="#09724a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="refunded"
                  name="İade Edilen"
                  fill="#df1c41"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category & User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Categories */}
        <Card className="border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
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
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
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
                  <span className="text-[12px] text-[#666d80]">
                    {cat.name} ({cat.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="lg:col-span-2 border-[#e5e7eb]">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Kullanıcı Artışı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0177fb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0177fb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#818898", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [Number(value).toLocaleString(), "Kullanıcı"]}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0177fb"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <Card className="border-[#e5e7eb]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            En Çok Performans Gösteren Etkinlikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Etkinlik Adı
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Satılan Biletler
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Gelir
                  </th>
                </tr>
              </thead>
              <tbody>
                {topEvents.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-full bg-[#e1eee3] flex items-center justify-center text-[14px] font-semibold text-[#09724a]">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                      {event.name}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#666d80]">
                      {event.tickets.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[14px] font-semibold text-[#0d0d12]">
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
