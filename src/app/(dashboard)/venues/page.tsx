"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  CheckCircle,
  XCircle,
  DoorOpen,
  Loader2,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { VenueForm } from "@/components/venues/venue-form";
import { venuesService } from "@/lib/api/services";
import type { Venue } from "@/lib/api/types/biletleme.types";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for fallback
  const mockVenues: Venue[] = [
    {
      id: 1,
      name: "Harbiye Açık Hava Tiyatrosu",
      slug: "harbiye-acik-hava-tiyatrosu",
      address: "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
      city: "İstanbul",
      district: "Şişli",
      map_url: null,
      description: null,
      image: null,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "İstanbul Lütfi Kırdar Kongre Merkezi",
      slug: "istanbul-lutfi-kirdar-kongre-merkezi",
      address: "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
      city: "İstanbul",
      district: "Şişli",
      map_url: null,
      description: null,
      image: null,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Zorlu PSM Turkcell Platinum Sahne",
      slug: "zorlu-psm-turkcell-platinum-sahne",
      address: "Bağdat Caddesi, Zorlu Center",
      city: "İstanbul",
      district: "Kadıköy",
      map_url: null,
      description: null,
      image: null,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 4,
      name: "Ankara Congresium",
      slug: "ankara-congresium",
      address: "Söğütözü Mahallesi, Bilkent",
      city: "Ankara",
      district: "Çankaya",
      map_url: null,
      description: null,
      image: null,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 5,
      name: "İzmir Arena",
      slug: "izmir-arena",
      address: "Gaziemir Mahallesi, Arena Caddesi",
      city: "İzmir",
      district: "Gaziemir",
      map_url: null,
      description: null,
      image: null,
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  // Load venues
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setIsLoading(true);
        try {
          const response = await venuesService.getAll();
          setVenues(response.data);
        } catch (error) {
          console.error("Mekanlar yüklenirken hata:", error);
          // Fallback to mock data if API is not available
          setVenues(mockVenues);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

  // Filter venues
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && venue.is_active) ||
        (statusFilter === "inactive" && !venue.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [venues, searchQuery, statusFilter]);

  // Handle venue creation success
  const handleCreateSuccess = (newVenue: Venue) => {
    setVenues((prev) => [...prev, newVenue]);
    setIsCreateDialogOpen(false);
  };

  // Handle venue update success
  const handleEditSuccess = (updatedVenue: Venue) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v))
    );
    setEditingVenue(null);
  };

  // Handle edit button click - fetch venue detail first
  const handleEditClick = async (venue: Venue) => {
    try {
      setIsLoadingDetail(true);
      const detail = await venuesService.getById(venue.id);
      setEditingVenue(detail);
    } catch (error) {
      console.error("Mekan detayı yüklenirken hata:", error);
      // Fallback to using the list data
      setEditingVenue(venue);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Handle venue delete
  const handleDelete = async () => {
    if (!deletingVenue) return;

    try {
      setIsDeleting(true);
      const response = await venuesService.delete(deletingVenue.id);

      if (response.success) {
        setVenues((prev) => prev.filter((v) => v.id !== deletingVenue.id));
        setDeletingVenue(null);
      }
    } catch (error: any) {
      console.error("Failed to delete venue:", error);
      const errorMessage = error?.response?.data?.message || "Mekan silinirken bir hata oluştu";
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusVariantMap = {
    active: "success" as const,
    inactive: "warning" as const,
  };

  const statusLabels = {
    active: "Aktif",
    inactive: "Pasif",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Mekanlar
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Etkinlik mekanlarını yönetin ve görüntüleyin
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Mekan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="stats" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm text-on-surface-variant mb-3 uppercase tracking-wide font-semibold">Toplam</p>
              <p className="display-lg text-on-surface leading-none">
                {venues.length}
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
                {venues.filter((v) => v.is_active).length}
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
                {venues.filter((v) => !v.is_active).length}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center shadow-sm">
              <XCircle className="w-7 h-7 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            placeholder="Mekan ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "primary" : "secondary"}
              size="small"
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" && "Tümü"}
              {status === "active" && "Aktif"}
              {status === "inactive" && "Pasif"}
            </Button>
          ))}
        </div>
      </div>

      {/* Venues Table */}
      <Card variant="default" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline/30 bg-surface-low/50">
                <th className="text-left py-4 px-6 body-md font-semibold text-on-surface-variant">
                  Mekan
                </th>
                <th className="text-left py-4 px-6 body-md font-semibold text-on-surface-variant">
                  Konum
                </th>
                <th className="text-left py-4 px-6 body-md font-semibold text-on-surface-variant">
                  Durum
                </th>
                <th className="text-right py-4 px-6 body-md font-semibold text-on-surface-variant">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <p className="body-md text-on-surface-variant">Yükleniyor...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <MapPin className="w-12 h-12 text-on-surface-variant" />
                      <p className="body-md text-on-surface-variant">Mekan bulunamadı</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVenues.map((venue) => (
                  <tr
                    key={venue.id}
                    className="border-b border-outline/30 last:border-0 hover:bg-surface-low/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="body-md font-medium text-on-surface">
                          {venue.name}
                        </p>
                        {venue.description && (
                          <p className="body-sm text-on-surface-variant mt-1 line-clamp-1 max-w-md">
                            {venue.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="body-md text-on-surface">
                        {venue.city && venue.district
                          ? `${venue.district}, ${venue.city}`
                          : venue.city || venue.district || "-"}
                      </p>
                      <p className="body-sm text-on-surface-variant mt-1 line-clamp-1 max-w-md">
                        {venue.address}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={statusVariantMap[venue.is_active ? "active" : "inactive"]}>
                        {statusLabels[venue.is_active ? "active" : "inactive"]}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/venues/${venue.id}/stages`}>
                          <Button variant="secondary" size="small" className="h-9 px-4">
                            <DoorOpen className="w-4 h-4 mr-1.5" />
                            Salonlar
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="small"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditClick(venue)}
                          disabled={isLoadingDetail}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          className="h-8 w-8 p-0 text-danger hover:text-danger"
                          onClick={() => setDeletingVenue(venue)}
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
      </Card>

      {/* Create Venue Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Mekan Ekle</DialogTitle>
            <DialogDescription>
              Yeni bir etkinlik mekanı oluşturun. Zorunlu alanları doldurun.
            </DialogDescription>
          </DialogHeader>
          <VenueForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Venue Dialog */}
      <Dialog
        open={!!editingVenue}
        onOpenChange={(open) => !open && setEditingVenue(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mekanı Düzenle</DialogTitle>
            <DialogDescription>
              {editingVenue?.name} mekanının bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          {editingVenue && (
            <VenueForm
              venue={editingVenue}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingVenue(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingVenue}
        onOpenChange={(open) => !open && setDeletingVenue(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mekanı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingVenue?.name}</strong> mekanını silmek istediğinize
              emin misiniz? Bu işlem geri alınamaz. Mekana bağlı etkinlikler
              varsa silme işlemi başarısız olabilir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
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
