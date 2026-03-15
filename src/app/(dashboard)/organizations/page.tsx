"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { organizationsService } from "@/lib/api/services";
import type { Organization } from "@/lib/api/types/biletleme.types";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");

  // Mock data for now - will be replaced with API call
  const mockOrganizations: Organization[] = [
    {
      id: 1,
      name: "BKM",
      slug: "bkm",
      description: "Büyük Kültür Yolu",
      city: "İstanbul",
      country: "Türkiye",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Zorlu PSM",
      slug: "zorlu-psm",
      description: "Zorlu Performing Arts Center",
      city: "İstanbul",
      country: "Türkiye",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Anadolu Gösteri",
      slug: "anadolu-gosteri",
      description: "Anadolu Gösteri Grubu",
      city: "Ankara",
      country: "Türkiye",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 4,
      name: "Ege Etkinlik",
      slug: "ege-etkinlik",
      description: "Ege Etkinlik Grubu",
      city: "İzmir",
      country: "Türkiye",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  // Load organizations
  useState(() => {
    // Simulate loading
    setTimeout(() => {
      setOrganizations(mockOrganizations);
      setIsLoading(false);
    }, 500);
  });

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  const statusVariantMap: Record<string, "success" | "warning" | "danger"> = {
    active: "success",
    inactive: "warning",
    suspended: "danger",
  };

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    inactive: "Pasif",
    suspended: "Askıya Alındı",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Organizasyonlar
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Organizasyonları yönetin ve görüntüleyin
          </p>
        </div>
        <Button className="bg-[#09724a] hover:bg-[#0d8a52] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Organizasyon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Toplam</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {organizations.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#09724a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Aktif</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {organizations.filter((o) => o.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ecfdf3] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Pasif</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {organizations.filter((o) => o.status === "inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fffbeb] flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Toplam Mekan</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {/* This will be calculated from venues */}
                  5
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#3b82f6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666d80]" />
          <Input
            placeholder="Organizasyon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-[#e5e7eb]"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive", "suspended"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "primary" : "secondary"}
              onClick={() => setStatusFilter(status)}
              className={
                statusFilter === status
                  ? "bg-[#09724a] text-white"
                  : "bg-white border-[#e5e7eb] text-[#666d80] hover:bg-[#f7f7f7]"
              }
            >
              {status === "all" && "Tümü"}
              {status === "active" && "Aktif"}
              {status === "inactive" && "Pasif"}
              {status === "suspended" && "Askıya Alındı"}
            </Button>
          ))}
        </div>
      </div>

      {/* Organizations Table */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Organizasyon
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Konum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Mekan Sayısı
                  </th>
                  <th className="text-right py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#666d80]">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredOrganizations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#666d80]">
                      Organizasyon bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[14px] font-medium text-[#0d0d12]">
                            {org.name}
                          </p>
                          {org.description && (
                            <p className="text-[12px] text-[#666d80] mt-0.5">
                              {org.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12]">
                          {org.city && org.country
                            ? `${org.city}, ${org.country}`
                            : "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariantMap[org.status]}>
                          {statusLabels[org.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12]">
                          {/* This will be fetched from venues */}
                          {org.id === 1 ? 2 : org.id === 2 ? 1 : org.id === 3 ? 1 : org.id === 4 ? 1 : 0}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/organizations/${org.id}`}>
                            <Button
                              variant="ghost"
                              size="small"
                              className="h-8 w-8 p-0 text-[#666d80] hover:text-[#09724a]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/organizations/${org.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="small"
                              className="h-8 w-8 p-0 text-[#666d80] hover:text-[#09724a]"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] hover:text-[#df1c41]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import icons at the top
import { Building2, CheckCircle, XCircle } from "lucide-react";
