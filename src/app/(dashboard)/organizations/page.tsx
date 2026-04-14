"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load organizations
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        const response = await organizationsService.getAll();
        setOrganizations(response.data);
      } catch (error) {
        console.error("Organizatörler yüklenirken hata:", error);
        setOrganizations([]);
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
        statusFilter === "all" ||
        (statusFilter === "active" && org.is_active === true) ||
        (statusFilter === "inactive" && org.is_active === false);

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchQuery, statusFilter]);

  const statusVariantMap: Record<string, "success" | "danger"> = {
    active: "success",
    inactive: "danger",
  };

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    inactive: "Pasif",
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

  // Handle edit button click - fetch organization detail first
  const handleEditClick = async (org: Organization) => {
    try {
      setIsLoadingDetail(true);
      const detail = await organizationsService.getById(org.id);
      setEditingOrganization(detail);
    } catch (error) {
      console.error("Organizatör detayı yüklenirken hata:", error);
      // Fallback to using the list data
      setEditingOrganization(org);
    } finally {
      setIsLoadingDetail(false);
    }
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
      }
    } catch (error: any) {
      console.error("Failed to delete organization:", error);
      const errorMessage = error?.message || "Organizatör silinirken bir hata oluştu";
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Organizatörler
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Organizatörleri yönetin ve görüntüleyin
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Organizatör
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam</p>
              <p className="display-lg text-on-surface leading-none">
                {organizations.length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
              <Building2 className="w-7 h-7 text-primary" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Aktif</p>
              <p className="display-lg text-on-surface leading-none">
                {organizations.filter((o) => o.is_active === true).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-7 h-7 text-success" />
            </div>
          </div>
        </Card>

        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Pasif</p>
              <p className="display-lg text-on-surface leading-none">
                {organizations.filter((o) => o.is_active === false).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center shadow-sm">
              <XCircle className="w-7 h-7 text-danger" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            placeholder="Organizatör ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "primary" : "secondary"}
              size="medium"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" && "Tümü"}
              {status === "active" && "Aktif"}
              {status === "inactive" && "Pasif"}
            </Button>
          ))}
        </div>
      </div>

      {/* Organizations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline/20 bg-surface-low">
                  <th className="text-left py-3 px-4 label-md text-on-surface-variant">
                    Organizatör
                  </th>
                  <th className="text-left py-3 px-4 label-md text-on-surface-variant">
                    Konum
                  </th>
                  <th className="text-left py-3 px-4 label-md text-on-surface-variant">
                    Durum
                  </th>
                  <th className="text-right py-3 px-4 label-md text-on-surface-variant">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-on-surface-variant"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredOrganizations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-on-surface-variant"
                    >
                      Organizatör bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      className="border-b border-outline/10 hover:bg-surface-low/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {org.logo_path ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-high">
                              <Image
                                src={org.logo_path}
                                alt={org.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="body-md font-medium text-on-surface">
                              {org.name}
                            </p>
                            {org.description && (
                              <p className="body-sm text-on-surface-variant mt-0.5 line-clamp-1">
                                {org.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="body-md text-on-surface">
                          {org.city && org.district
                            ? `${org.district}, ${org.city}`
                            : org.city || org.district || "-"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariantMap[org.is_active ? "active" : "inactive"]}>
                          {statusLabels[org.is_active ? "active" : "inactive"]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/organizations/${org.id}`}>
                            <Button
                              variant="ghost"
                              size="small"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditClick(org)}
                            disabled={isLoadingDetail}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90"
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
