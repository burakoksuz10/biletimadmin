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
  TrendingUp,
  DoorOpen,
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
import { VenueForm } from "@/components/venues/venue-form";
import { venuesService } from "@/lib/api/services";
import type { Venue } from "@/lib/api/types/biletleme.types";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
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
            Mekanlar
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Etkinlik mekanlarını yönetin ve görüntüleyin
          </p>
        </div>
        <Button
          className="bg-[#09724a] hover:bg-[#0d8a52] text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Mekan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80] dark:text-[#9ca3af]">Toplam</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] dark:text-[#f9fafb] mt-1">
                  {venues.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] dark:bg-[#1a2e1f] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#09724a] dark:text-[#00fb90]" />
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
                  {venues.filter((v) => v.is_active).length}
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
                  {venues.filter((v) => !v.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fffbeb] dark:bg-[#2e2a1a] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#f59e0b] dark:text-[#fbbf24]" />
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
            placeholder="Mekan ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-[#e5e7eb] dark:border-[#374151] dark:bg-[#1f2937] dark:text-[#f9fafb] dark:placeholder:text-[#6b7280]"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map(
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
              </Button>
            )
          )}
        </div>
      </div>

      {/* Venues Table */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] dark:border-[#374151] bg-[#f7f7f7] dark:bg-[#1f2937]">
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Mekan
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Konum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                    Durum
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
                      colSpan={4}
                      className="py-8 text-center text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredVenues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-[#666d80] dark:text-[#9ca3af]"
                    >
                      Mekan bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredVenues.map((venue) => (
                    <tr
                      key={venue.id}
                      className="border-b border-[#e5e7eb] dark:border-[#374151] hover:bg-[#f7f7f7] dark:hover:bg-[#1f2937] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[14px] font-medium text-[#0d0d12] dark:text-[#f9fafb]">
                            {venue.name}
                          </p>
                          {venue.description && (
                            <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af] mt-0.5 truncate max-w-xs">
                              {venue.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12] dark:text-[#f9fafb]">
                          {venue.city}, {venue.district}
                        </p>
                        <p className="text-[12px] text-[#666d80] dark:text-[#9ca3af] mt-0.5 truncate max-w-xs">
                          {venue.address}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={venue.is_active ? "success" : "warning"}>
                          {venue.is_active ? "Aktif" : "Pasif"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/venues/${venue.id}/stages`}>
                            <Button
                              variant="primary"
                              size="small"
                              className="h-9 px-4 bg-[#09724a] hover:bg-[#0d8a52] text-white font-medium transition-colors"
                            >
                              <DoorOpen className="w-4 h-4 mr-1.5" />
                              Salonlar
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] dark:text-[#9ca3af] hover:text-[#09724a] dark:hover:text-[#00fb90]"
                            onClick={() => setEditingVenue(venue)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] dark:text-[#9ca3af] hover:text-[#df1c41] dark:hover:text-[#ff6b8a]"
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
        </CardContent>
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
