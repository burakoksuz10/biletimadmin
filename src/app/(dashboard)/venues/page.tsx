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
  Users,
  TrendingUp,
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
    "all" | "active" | "inactive" | "maintenance"
  >("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for now - will be replaced with API call
  const mockVenues: Venue[] = [
    {
      id: 1,
      organization_id: 1,
      name: "Harbiye Açık Hava Tiyatrosu",
      slug: "harbiye-acik-hava-tiyatrosu",
      address: "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
      city: "İstanbul",
      country: "Türkiye",
      capacity: 7000,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      organization_id: 1,
      name: "İstanbul Lütfi Kırdar Kongre Merkezi",
      slug: "istanbul-lutfi-kirdar-kongre-merkezi",
      address: "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
      city: "İstanbul",
      country: "Türkiye",
      capacity: 3500,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      organization_id: 2,
      name: "Zorlu PSM Turkcell Platinum Sahne",
      slug: "zorlu-psm-turkcell-platinum-sahne",
      address: "Bağdat Caddesi, Zorlu Center",
      city: "İstanbul",
      country: "Türkiye",
      capacity: 2500,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 4,
      organization_id: 3,
      name: "Ankara Congresium",
      slug: "ankara-congresium",
      address: "Söğütözü Mahallesi, Bilkent",
      city: "Ankara",
      country: "Türkiye",
      capacity: 2000,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 5,
      organization_id: 4,
      name: "İzmir Arena",
      slug: "izmir-arena",
      address: "Gaziemir Mahallesi, Arena Caddesi",
      city: "İzmir",
      country: "Türkiye",
      capacity: 1500,
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];

  // Load venues
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setIsLoading(true);
        // Try to load from API first, fallback to mock data
        try {
          const data = await venuesService.getAll();
          setVenues(data);
        } catch {
          // Fallback to mock data if API is not available
          setVenues(mockVenues);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []);

  // Organization names mapping
  const organizationNames: Record<number, string> = {
    1: "BKM",
    2: "Zorlu PSM",
    3: "Anadolu Gösteri",
    4: "Ege Etkinlik",
  };

  // Filter venues
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || venue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [venues, searchQuery, statusFilter]);

  const statusVariantMap: Record<string, "success" | "warning" | "danger"> = {
    active: "success",
    inactive: "warning",
    maintenance: "danger",
  };

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    inactive: "Pasif",
    maintenance: "Bakımda",
  };

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
      await venuesService.delete(deletingVenue.id);
      setVenues((prev) => prev.filter((v) => v.id !== deletingVenue.id));
      setDeletingVenue(null);
    } catch (error) {
      console.error("Failed to delete venue:", error);
      // TODO: Show error toast
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Toplam</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {venues.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#09724a]" />
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
                  {venues.filter((v) => v.status === "active").length}
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
                <p className="text-[14px] text-[#666d80]">Toplam Kapasite</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {venues
                    .reduce((sum, v) => sum + v.capacity, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#3b82f6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] text-[#666d80]">Ort. Kapasite</p>
                <p className="text-[28px] font-semibold text-[#0d0d12] mt-1">
                  {venues.length > 0
                    ? Math.round(
                        venues.reduce((sum, v) => sum + v.capacity, 0) /
                          venues.length
                      ).toLocaleString()
                    : "0"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fffbeb] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#f59e0b]" />
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
            placeholder="Mekan ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-[#e5e7eb]"
          />
        </div>

        <div className="flex gap-2">
          {(["all", "active", "inactive", "maintenance"] as const).map(
            (status) => (
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
                {status === "maintenance" && "Bakımda"}
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
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Mekan
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Organizatör
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Konum
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Kapasite
                  </th>
                  <th className="text-left py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    Durum
                  </th>
                  <th className="text-right py-3 px-4 text-[14px] font-medium text-[#0d0d12]">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-[#666d80]"
                    >
                      Yükleniyor...
                    </td>
                  </tr>
                ) : filteredVenues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-[#666d80]"
                    >
                      Mekan bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredVenues.map((venue) => (
                    <tr
                      key={venue.id}
                      className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[14px] font-medium text-[#0d0d12]">
                            {venue.name}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#666d80]" />
                          <p className="text-[14px] text-[#0d0d12]">
                            {organizationNames[venue.organization_id] || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12]">
                          {venue.city}, {venue.country}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[14px] text-[#0d0d12]">
                          {venue.capacity.toLocaleString()} kişi
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariantMap[venue.status]}>
                          {statusLabels[venue.status]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/venues/${venue.id}`}>
                            <Button
                              variant="ghost"
                              size="small"
                              className="h-8 w-8 p-0 text-[#666d80] hover:text-[#09724a]"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] hover:text-[#09724a]"
                            onClick={() => setEditingVenue(venue)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            className="h-8 w-8 p-0 text-[#666d80] hover:text-[#df1c41]"
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
