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
  User,
  Users,
  Crown,
  Star,
  Download,
  TrendingUp,
  Ticket,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { customersService } from "@/lib/api/services";
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await customersService.getAll();
        setCustomers(response.data);
      } catch (error: any) {
        console.error("Müşteriler yüklenirken hata:", error);
      } finally {
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
          (customer.phone && customer.phone.includes(searchQuery));

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
            comparison = (a.total_spent || 0) - (b.total_spent || 0);
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
      totalRevenue: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
      totalTickets: customers.reduce((sum, c) => sum + (c.total_tickets || 0), 0),
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Müşteriler
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Bilet alan müşterileri görüntüleyin ve yönetin
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <User className="w-4 h-4 mr-2" />
            Yeni Müşteri
          </Button>
        </div>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.total}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Aktif</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.active}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <Shield className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">VIP</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.vip}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center shadow-sm">
              <Crown className="w-7 h-7 text-warning" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Bu Ay Yeni</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.new}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center shadow-sm">
              <Star className="w-7 h-7 text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Harcama</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.totalRevenue.toLocaleString()} ₺
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-7 h-7 text-secondary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam Bilet</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.totalTickets.toLocaleString()}
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
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Yasaklı</p>
              <p className="display-lg text-on-surface leading-none">
                {stats.banned}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center shadow-sm">
              <Ban className="w-7 h-7 text-danger" />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-outline/30">
        {(["all", "active", "suspended", "banned"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 body-md font-medium border-b-2 transition-colors ${
              statusFilter === status
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline/50"
            }`}
          >
            {status === "all"
              ? "Tümü"
              : status === "active"
              ? "Aktif"
              : status === "suspended"
              ? "Askıda"
              : "Yasaklı"}
            <span className="ml-2 body-sm text-on-surface-variant">
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
              className={`px-3 py-1.5 rounded-lg body-sm font-medium transition-colors ${
                segmentFilter === segment
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "bg-surface-low text-on-surface-variant hover:text-on-surface hover:bg-surface-low/80"
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
              <span className="ml-1 label-sm opacity-75">
                ({segmentCounts[segment]})
              </span>
            </button>
          )
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            type="search"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          Filtreler
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-xl p-4">
          <p className="body-md text-success font-medium">
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
              variant="ghost"
              size="small"
              onClick={() => handleBulkAction("ban")}
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <Ban className="w-4 h-4 mr-2" />
              Yasakla
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline/30 bg-surface-low/50">
                <th className="text-left py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
                <th
                  className="text-left py-4 px-6 cursor-pointer hover:bg-surface-low/30 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Müşteri</span>
                    <ArrowUpDown className="w-3 h-3 text-on-surface-variant" />
                  </div>
                </th>
                <th className="text-left py-4 px-6">
                  <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">İletişim</span>
                </th>
                <th className="text-left py-4 px-6">
                  <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Müşteri Grubu</span>
                </th>
                <th className="text-left py-4 px-6">
                  <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Durum</span>
                </th>
                <th className="text-right py-4 px-6">
                  <span className="label-sm font-semibold text-on-surface-variant uppercase tracking-wide">İşlemler</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="body-md text-on-surface-variant">Yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <User className="w-12 h-12 text-on-surface-variant" />
                      <p className="body-md text-on-surface-variant">Müşteri bulunamadı</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-outline/30 last:border-0 hover:bg-surface-low/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          {customer.avatar ? (
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="body-md font-medium text-on-surface">
                            {customer.name}
                          </p>
                          <div className="flex items-center gap-1 body-sm text-on-surface-variant">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-on-surface-variant" />
                        <p className="body-md text-on-surface-variant">
                          {customer.phone || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {customer.user_group_label && (
                        <Badge variant="info">
                          {customer.user_group_label}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={statusVariantMap[customer.status]}>
                        {statusLabels[customer.status]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/customers/${customer.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary/10 text-on-surface-variant hover:text-secondary transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {customer.status === "active" ? (
                          <button
                            onClick={() => {
                              console.log("Askıya al:", customer.id);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-warning/10 text-on-surface-variant hover:text-warning transition-colors"
                            title="Askıya Al"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              console.log("Etkinleştir:", customer.id);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-success/10 text-on-surface-variant hover:text-success transition-colors"
                            title="Etkinleştir"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
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
        <div className="flex items-center justify-between p-4 border-t border-outline/30">
          <p className="body-md text-on-surface-variant">
            {filteredCustomers.length} sonuçtan gösteriliyor
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="small"
              disabled={true}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Önceki
            </Button>
            <Button
              variant="primary"
              size="small"
            >
              1
            </Button>
            <Button
              variant="secondary"
              size="small"
              disabled={true}
            >
              Sonraki
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
