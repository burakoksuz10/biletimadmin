"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  DoorOpen,
  Loader2,
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
import { StageForm } from "@/components/stages/stage-form";
import { venuesService, stagesService, type ApiStage } from "@/lib/api/services";
import type { Venue } from "@/lib/api/types/biletleme.types";

const SEATING_TYPE_LABELS: Record<string, string> = {
  seated: "Oturmalı",
  standing: "Ayakta",
  mixed: "Karma",
};

export default function VenueStagesPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = parseInt(params.id as string);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [stages, setStages] = useState<ApiStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ApiStage | null>(null);
  const [deletingStage, setDeletingStage] = useState<ApiStage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [venueData, stagesData] = await Promise.all([
          venuesService.getById(venueId),
          stagesService.getByVenue(venueId),
        ]);
        setVenue(venueData);
        setStages(stagesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        router.push("/venues");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [venueId, router]);

  const filteredStages = stages.filter((stage) =>
    stage.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSuccess = (newStage: ApiStage) => {
    setStages((prev) => [...prev, newStage]);
    setIsCreateDialogOpen(false);
  };

  const handleEditSuccess = (updatedStage: ApiStage) => {
    setStages((prev) =>
      prev.map((s) => (s.id === updatedStage.id ? updatedStage : s))
    );
    setEditingStage(null);
  };

  const handleDelete = async () => {
    if (!deletingStage) return;

    try {
      setIsDeleting(true);
      await stagesService.delete(venueId, deletingStage.id);
      setStages((prev) => prev.filter((s) => s.id !== deletingStage.id));
      setDeletingStage(null);
    } catch (error: any) {
      console.error("Failed to delete stage:", error);
      alert(error?.message || "Salon silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#09724a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/venues">
            <Button variant="ghost" size="small" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="headline-lg font-semibold text-on-surface">
              {venue?.name} - Salonlar
            </h1>
            <p className="body-md text-on-surface-variant">
              {venue?.city}, {venue?.district}
            </p>
          </div>
        </div>
        <Button
          className="bg-[#09724a] hover:bg-[#0d8a52] text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Salon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-md text-on-surface-variant dark:text-[#9ca3af]">Toplam Salon</p>
                <p className="display-sm font-semibold text-on-surface dark:text-[#f9fafb] mt-1">
                  {stages.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e1eee3] dark:bg-[#1a2e1f] flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-[#09724a] dark:text-[#00fb90]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-md text-on-surface-variant dark:text-[#9ca3af]">Toplam Kapasite</p>
                <p className="display-sm font-semibold text-on-surface dark:text-[#f9fafb] mt-1">
                  {stages.reduce((sum, s) => sum + s.capacity, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] dark:bg-[#1a242e] flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-[#3b82f6] dark:text-[#60a5fa]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-md text-on-surface-variant dark:text-[#9ca3af]">Toplam Koltuk</p>
                <p className="display-sm font-semibold text-on-surface dark:text-[#f9fafb] mt-1">
                  {stages.reduce((sum, s) => sum + (s.seats_count || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fffbeb] dark:bg-[#2e2a1a] flex items-center justify-center">
                <DoorOpen className="w-6 h-6 text-[#f59e0b] dark:text-[#fbbf24]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant dark:text-[#9ca3af]" />
          <Input
            placeholder="Salon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-[#e5e7eb] dark:border-[#374151]"
          />
        </div>
      </div>

      {/* Stages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-on-surface-variant">
            <DoorOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Salon bulunamadı</p>
          </div>
        ) : (
          filteredStages.map((stage) => (
            <Card key={stage.id} className="border-[#e5e7eb] hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="title-lg font-semibold text-on-surface mb-1">
                      {stage.name}
                    </h3>
                    <Badge variant="success" className="text-xs">
                      {SEATING_TYPE_LABELS[stage.seating_type || "seated"]}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="small"
                      className="h-8 w-8 p-0 text-on-surface-variant hover:text-[#09724a]"
                      onClick={() => setEditingStage(stage)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      className="h-8 w-8 p-0 text-on-surface-variant hover:text-[#df1c41]"
                      onClick={() => setDeletingStage(stage)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Kapasite:</span>
                    <span className="font-medium text-on-surface">{stage.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Koltuk Sayısı:</span>
                    <span className="font-medium text-on-surface">{stage.seats_count?.toLocaleString() || 0}</span>
                  </div>
                  {stage.gate_info && (
                    <div className="flex justify-between">
                      <span>Kapı:</span>
                      <span className="font-medium text-on-surface">{stage.gate_info}</span>
                    </div>
                  )}
                </div>
                <Link href={`/stages/${stage.id}/seating-plan`}>
                  <Button
                    variant="secondary"
                    className="w-full mt-4 text-sm"
                    size="small"
                  >
                    Oturma Planı Düzenle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Stage Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Salon Ekle</DialogTitle>
            <DialogDescription>
              {venue?.name} mekanına yeni salon oluşturun.
            </DialogDescription>
          </DialogHeader>
          <StageForm
            venueId={venueId}
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Stage Dialog */}
      <Dialog open={!!editingStage} onOpenChange={(open) => !open && setEditingStage(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Salonu Düzenle</DialogTitle>
            <DialogDescription>
              {editingStage?.name} salonunun bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          {editingStage && (
            <StageForm
              venueId={venueId}
              stage={editingStage}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingStage(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingStage}
        onOpenChange={(open) => !open && setDeletingStage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Salonu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deletingStage?.name}</strong> salonunu silmek istediğinize
              emin misiniz? Bu işlem geri alınamaz.
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
