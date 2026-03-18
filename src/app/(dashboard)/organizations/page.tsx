"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrganizationForm } from "@/components/organizations/organization-form";
import { organizationsService } from "@/lib/api/services";
import type { Organization } from "@/lib/api/types/biletleme.types";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "suspended"
  >("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] =
    useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        // Try to load from API first, fallback to mock data
        try {
          const response = await organizationsService.getAll();
          setOrganizations(response.data);
        } catch (error) {
          console.error("Organizatörler yüklenirken hata:", error);
          // Fallback to mock data if API is not available
          setOrganizations(mockOrganizations);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  const statusVariantMap: Record<
    string,
    "success" | "warning" | "danger"
  > = {
    active: "success",
    inactive: "warning",
    suspended: "danger",
  };

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    inactive: "Pasif",
    suspended: "Askıya Alındı",
  };

  // Mock venue counts - will be fetched from API
  const getVenueCount = (orgId: number) => {
    return orgId === 1 ? 2 : orgId === 2 ? 1 : orgId === 3 ? 1 : orgId === 4 ? 1 : 0;
  };

  // Handle organization creation success
  const handleCreateSuccess = (newOrganization: Organization) => {
    setOrganizations((prev) => [...prev, newOrganization]);
    setIsCreateDialogOpen(false);
  };

  // Handle organization update success
  const handleEditSuccess = (updatedOrganization: Organization) => {
    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === updatedOrganization.id ? updatedOrganization : o
      )
    );
    setEditingOrganization(null);
  };

  // Handle organization delete
  const handleDelete = async () => {
    if (!deletingOrganization) return;

    try {
      setIsDeleting(true);
      const response = await organizationsService.delete(deletingOrganization.id);
      
      if (response.success) {
        setOrganizations((prev) =>
          prev.filter((o) => o.id !== deletingOrganization.id)
        );
        setDeletingOrganization(null);
        // TODO: Show success toast with message: response.message
      }
    } catch (error: any) {
      console.error("Failed to delete organization:", error);
      // Extract error message from API response
      const errorMessage = error?.response?.data?.message || "Organizatör silinirken bir hata oluştu";
      // TODO: Show error toast with errorMessage
      alert(errorMessage); // Temporary until toast is implemented
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Organizatörler
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Organizatörleri yönetin ve görüntüleyin
          </p>
        </div>
        <Button
          className="bg-[#09724a] hover:bg-[#0d8a52] text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Organizatör
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">Toplam</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] dark:text-[#f9fafb] mt-1">
                  {organizations.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] dark:bg-[#1a2e1f] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#09724a] dark:text-[#00fb90]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">Aktif</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] dark:text-[#f9fafb] mt-1">
                  {organizations.filter((o) => o.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ecfdf3] dark:bg-[#1a2e1f] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#10b981] dark:text-[#00fb90]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">Pasif</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] dark:text-[#f9fafb] mt-1">
                  {organizations.filter((o) => o.status === "inactive").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fffbeb] dark:bg-[#2e2a1a] flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#f59e0b] dark:text-[#fbbf24]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">Toplam Mekan</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] dark:text-[#f9fafb] mt-1">
                  {organizations.reduce((sum, o) => sum + getVenueCount(o.id), 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] dark:bg-[#1a242e] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#3b82f6] dark:text-[#60a5fa]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666d80] dark:text-[#9ca3af]" />
          <Input
            placeholder="Organizatör ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937] dark:text-[#f9fafb] dark:placeholder:text-[#6b7280]"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive", "suspended"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "secondary"}
                onClick={() => setStatusFilter(status)}
                className={
                  statusFilter === status
                    ? "bg-[#09724a] text-white dark:bg-[#00fb90] dark:text-[#0d0d12]"
                    : "bg-white border-[#e5e7eb] text-[#666d80] hover:bg-[#f7f7f7] dark:bg-[#1f2937] dark:border-[#374151] dark:text-[#9ca3af] dark:hover:bg-[#374151]"
                }
              >
                {status === "all" && "Tümü"}
                {status === "active" && "Aktif"}
                {status === "inactive" && "Pasif"}
                {status === "suspended" && "Askıya Alındı"}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Organizations Table */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#374151] bg-[#f7f7f7] dark:bg-[#1f2937]">
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Organizatör
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Konum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Mekan Sayısı
                  </th>
                  <th className="text-right py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredOrganizations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Organizatör bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-[#e5e7eb] dark:border-[#374151] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2937] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                            {org.name}
                          </p>
                          {org.description && (
                            <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af] mt-0.5">
                              {org.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12] dark:text-[#f9fafb]">
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
                        <p className="text-[14px] text-[#0d0d12] dark:text-[#f9fafb]">
                          {getVenueCount(org.id)}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/organizations/${org.id}`}>
                            <Button
                              variant="ghost"
                              size="small"
                              className="h-8 w-8 p-0 text-[#666d80] dark:text-[#9ca3af] hover:text-[#09724a] dark:hover:text-[#00fb90]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] dark:text-[#9ca3af] hover:text-[#09724a] dark:hover:text-[#00fb90]"
                            onClick={() => setEditingOrganization(org)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] dark:text-[#9ca3af] hover:text-[#df1c41] dark:hover:text-[#ff6b8a]"
                            onClick={() => setDeletingOrganization(org)}
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

      {/* Create Organization Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Organizatör Ekle</DialogTitle>
            <DialogDescription>
              Yeni bir organizatör oluşturun. Zorunlu alanları doldurun.
            </DialogDescription>
          </DialogHeader>
          <OrganizationForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      <Dialog
        open={!!editingOrganization}
        onOpenChange={(open) => !open && setEditingOrganization(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organizatörü Düzenle</DialogTitle>
            <DialogDescription>
              {editingOrganization?.name} organizatörünün bilgilerini
              güncelleyin.
            </DialogDescription>
          </DialogHeader>
          {editingOrganization && (
            <OrganizationForm
              organization={editingOrganization}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingOrganization(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingOrganization}
        onOpenChange={(open) => !open && setDeletingOrganization(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Organizatörü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingOrganization?.name}</strong> organizatörünü
              silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              Organizatöre bağlı mekanlar veya etkinlikler varsa silme işlemi
              başarısız olabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#df1c41] hover:bg-[#c4183a]"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
