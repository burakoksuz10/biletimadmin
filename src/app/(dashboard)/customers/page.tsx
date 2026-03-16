"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Ban,
  Shield,
  ArrowUpDown,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  Users,
  Crown,
  Star,
  Download,
  MoreHorizontal,
  UserCheck,
  TrendingUp,
  CreditCard,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { mockCustomers } from "@/lib/mock-data/customers";
import type { CustomerListItem, CustomerStatus, CustomerSegment } from "@/types/customer.types";

const statusVariantMap: Record<CustomerStatus, "success" | "warning" | "danger"> = {
  active: "success",
  suspended: "warning",
  banned: "danger",
};

const statusLabels: Record<CustomerStatus, string> = {
  active: "Aktif",
  suspended: "Askıya Alındı",
  banned: "Yasaklandı",
};

const segmentVariantMap: Record<CustomerSegment, "success" | "info" | "neutral" | "warning" | "danger"> = {
  vip: "success",
  regular: "info",
  new: "neutral",
  at_risk: "warning",
  lost: "danger",
  one_time: "neutral",
};

const segmentLabels: Record<CustomerSegment, string> = {
  vip: "VIP",
  regular: "Normal",
  new: "Yeni",
  at_risk: "Riskli",
  lost: "Kayıp",
  one_time: "Tek Seferlik",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "created_at" | "total_spent" | "last_order">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showActionsId, setShowActionsId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => {
          setCustomers(mockCustomers);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to load customers:", error);
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery);

        const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
        const matchesSegment = segmentFilter === "all" || customer.customer_segment === segmentFilter;

        return matchesSearch && matchesStatus && matchesSegment;
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name, "tr");
            break;
          case "created_at":
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            break;
          case "total_spent":
            comparison = a.total_spent - b.total_spent;
            break;
          case "last_order":
            const aDate = a.last_order_date ? new Date(a.last_order_date).getTime() : 0;
            const bDate = b.last_order_date ? new Date(b.last_order_date).getTime() : 0;
            comparison = aDate - bDate;
            break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [customers, searchQuery, statusFilter, segmentFilter, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((c) => c.status === "active").length,
      suspended: customers.filter((c) => c.status === "suspended").length,
      banned: customers.filter((c) => c.status === "banned").length,
      vip: customers.filter((c) => c.customer_segment === "vip").length,
      new: customers.filter((c) => c.customer_segment === "new").length,
      totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
    };
  }, [customers]);

  const statusCounts = useMemo(() => {
    const counts = { all: customers.length, active: 0, suspended: 0, banned: 0 };
    customers.forEach((c) => {
      counts[c.status]++;
    });
    return counts;
  }, [customers]);

  const segmentCounts = useMemo(() => {
    const counts = { all: customers.length, vip: 0, regular: 0, new: 0, at_risk: 0, lost: 0, one_time: 0 };
    customers.forEach((c) => {
      if (c.customer_segment) {
        counts[c.customer_segment]++;
      } else {
        counts.regular++;
      }
    });
    return counts;
  }, [customers]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    }
  };

  const handleSelectCustomer = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: "suspend" | "activate" | "ban") => {
    console.log(`Bulk action: ${action} for customers:`, selectedIds);
    // TODO: Implement bulk action
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Müşteriler
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Bilet alan müşterileri görüntüleyin ve yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="h-10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-[#09724a] hover:bg-[#0d8a52] text-white h-10">
            <UserCheck className="w-4 h-4 mr-2" />
            Yeni Müşteri
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e1eee3] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Müşteri</p>
                <p className="text-[20px] font-semibold text-[#0d0d12]">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#ecfdf3] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Aktif</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {stats.active}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff8f0] flex items-center justify-center">
                <Ban className="w-6 h-6 text-[#d39c3d]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Askıya Alındı</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {stats.suspended}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fff0f3] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#df1c41]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">VIP Müşteriler</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {stats.vip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#effafa] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Harcama</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {stats.totalRevenue.toLocaleString()} ₺
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                <Ticket className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Toplam Bilet</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {customers.reduce((sum, c) => sum + c.total_tickets, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fffbeb] flex items-center justify-center">
                <Star className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <p className="text-[12px] text-[#666d80]">Bu Ay Yeni</p>
                <p className="text-[20px] font-semibold text-[#0d0d0d12]">
                  {stats.new}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
        {(["all", "active", "suspended", "banned"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
              statusFilter === status
                ? "border-[#09724a] text-[#09724a]"
                : "border-transparent text-[#666d80] hover:text-[#0d0d12]"
            }`}
          >
            {status === "all"
              ? "Tümü"
              : status === "active"
              ? "Aktif"
              : status === "suspended"
              ? "Askıda"
              : "Yasaklı"}
            <span className="ml-2 text-[12px] text-[#818898]">
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Segment Tabs */}
      <div className="flex items-center gap-2">
        {(["all", "vip", "regular", "new", "at_risk", "lost", "one_time"] as const).map(
          (segment) => (
            <button
              key={segment}
              onClick={() => setSegmentFilter(segment)}
              className={`px-3 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${
                segmentFilter === segment
                  ? "bg-[#09724a] text-white"
                  : "bg-[#f7f7f7] text-[#666d80] hover:text-[#0d0d12]"
              }`}
            >
              {segment === "all"
                ? "Tümü"
              : segment === "vip"
              ? "VIP"
              : segment === "regular"
              ? "Normal"
              : segment === "new"
              ? "Yeni"
              : segment === "at_risk"
              ? "Riskli"
              : segment === "lost"
              ? "Kayıp"
              : "Tek Seferlik"}
              <span className="ml-1 text-[12px] opacity-75">
                ({segmentCounts[segment]})
              </span>
            </button>
          )
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#818898]" />
          <Input
            type="search"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-lg bg-[#f7f7f7] border-[#e5e7eb]"
          />
        </div>
        <Button variant="secondary" className="h-10">
          <Filter className="w-4 h-4 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-[#e1eee3] border border-[#09724a] rounded-lg p-3">
          <p className="text-[14px] text-[#09724a]">
            {selectedIds.length} müşteri seçildi
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleBulkAction("suspend")}
            >
              <Ban className="w-4 h-4 mr-2" />
              Askıya Al
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleBulkAction("activate")}
            >
              <Shield className="w-4 h-4 mr-2" />
              Aktifleştir
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handleBulkAction("ban")}
              className="text-[#df1c41] hover:bg-[#fff8f0]"
            >
              <Ban className="w-4 h-4 mr-2" />
              Yasakla
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f7f7f7]">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-[#e5e7eb]"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Müşteri
                      <ArrowUpDown className="w-3 h-3 text-[#818898]" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">İletişim</th>
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-[#e5e7eb]"
                    onClick={() => handleSort("total_spent")}
                  >
                    <div className="flex items-center gap-1">
                      Harcama
                      <ArrowUpDown className="w-3 h-3 text-[#818898]" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Segment</th>
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-[#e5e7eb]"
                    onClick={() => handleSort("total_spent")}
                  >
                    <div className="flex items-center gap-1">
                      Siparişler
                      <ArrowUpDown className="w-3 h-3 text-[#818898]" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 cursor-pointer hover:bg-[#e5e7eb]"
                    onClick={() => handleSort("last_order")}
                  >
                    <div className="flex items-center gap-1">
                      Son Sipariş
                      <ArrowUpDown className="w-3 h-3 text-[#818898]" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4">Durum</th>
                  <th className="text-right py-3 px-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-[14px] text-[#666d80]"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-[14px] text-[#666d80]"
                    >
                      Müşteri bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e1eee3] border border-[#09724a] flex items-center justify-center flex-shrink-0">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-[#09724a]" />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[#0d0d12]">
                              {customer.name}
                            </p>
                            <div className="flex items-center gap-1 text-[12px] text-[#666d80]">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#818898]" />
                          <p className="text-[14px] text-[#666d80]">
                            {customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] font-medium text-[#0d0d0d12]">
                          {customer.total_spent.toLocaleString()} ₺
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        {customer.customer_segment && (
                          <Badge variant={segmentVariantMap[customer.customer_segment]}>
                            {segmentLabels[customer.customer_segment]}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d0d12]">
                          {customer.total_orders} sipariş
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#818898]" />
                          <p className="text-[14px] text-[#666d80]">
                            {customer.last_order_date
                              ? formatDate(customer.last_order_date)
                              : "-"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariantMap[customer.status]}>
                          {statusLabels[customer.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionsId(
                                showActionsId === customer.id ? null : customer.id
                              )
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f7f7f7] transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-[#666d80]" />
                          </button>

                          {showActionsId === customer.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg border border-[#e5e7eb] shadow-lg py-1 z-10">
                              <Link
                                href={`/customers/${customer.id}`}
                                className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                                onClick={() => setShowActionsId(null)}
                              >
                                <Eye className="w-4 h-4" />
                                Detayları Görüntüle
                              </Link>
                              <Link
                                href={`/customers/${customer.id}/edit`}
                                className="flex items-center gap-2 px-3 py-2 text-[14px] text-[#0d0d12] hover:bg-[#f7f7f7]"
                                onClick={() => setShowActionsId(null)}
                              >
                                <Edit className="w-4 h-4" />
                                Düzenle
                              </Link>
                              {customer.status === "active" && (
                                <button
                                  onClick={() => {
                                    setShowActionsId(null);
                                    // TODO: Suspend customer
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#d39c3d] hover:bg-[#fff8f0]"
                                >
                                  <Ban className="w-4 h-4" />
                                  Askıya Al
                                </button>
                              )}
                              {customer.status !== "active" && (
                                <button
                                  onClick={() => {
                                    setShowActionsId(null);
                                    // TODO: Activate customer
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-[#09724a] hover:bg-[#e1eee3]"
                                >
                                  <Shield className="w-4 h-4" />
                                  Etkinleştir
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#e5e7eb]">
            <p className="text-[14px] text-[#666d80]">
              {filteredCustomers.length} sonuçtan gösteriliyor
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                disabled={true}
                className="opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Önceki
              </Button>
              <Button
                variant="secondary"
                size="small"
                className="bg-[#09724a] text-white"
              >
                1
              </Button>
              <Button
                variant="secondary"
                size="small"
                disabled={true}
                className="opacity-50"
              >
                Sonraki
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
