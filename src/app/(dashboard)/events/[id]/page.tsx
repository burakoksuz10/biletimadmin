"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Building, 
  Tag, 
  Loader2, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Ticket,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { useEvent, useEventMutations } from "@/lib/hooks/use-events";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);
  
  const { event, loading, error, refresh } = useEvent(eventId);
  const { deleteEvent, updating } = useEventMutations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const success = await deleteEvent(eventId);
    if (success) {
      router.push("/events");
    }
  };

  const handlePublish = async () => {
    // TODO: Implement publish functionality
    refresh();
  };

  const handleCancel = async () => {
    // TODO: Implement cancel functionality
    refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#09724a]" />
          <p className="text-[14px] text-[#666d80] mt-2">Etkinlik yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[14px] text-[#df1c41]">{error || "Etkinlik bulunamadı"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  // Calculate ticket statistics
  const soldPercentage = event.total_tickets 
    ? Math.round((event.sold_tickets || 0) / event.total_tickets * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="headline-lg font-semibold text-on-surface">{event.title}</h1>
            <p className="body-md text-on-surface-variant mt-1">
              {event.category?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EventStatusBadge status={event.status} />
          <Button
            variant="outline"
            onClick={() => router.push(`/events/${event.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Düzenle
          </Button>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="danger">
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etkinliği Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    "Evet, Sil"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Featured Image */}
      {event.featured_image && (
        <Card className="border-[#e5e7eb] overflow-hidden">
          <div className="w-full h-64 bg-[#f7f7f7]">
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e5e7eb]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e1eee3] flex items-center justify-center">
                <Ticket className="w-5 h-5 text-[#09724a]" />
              </div>
              <div>
                <p className="label-md text-on-surface-variant">Satılan Biletler</p>
                <p className="headline-sm font-semibold text-on-surface">
                  {event.sold_tickets || 0} / {event.total_tickets || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e1eee3] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#09724a]" />
              </div>
              <div>
                <p className="label-md text-on-surface-variant">Tahmini Gelir</p>
                <p className="headline-sm font-semibold text-on-surface">
                  {formatCurrency((event.sold_tickets || 0) * (event.ticket_price || 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e1eee3] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#09724a]" />
              </div>
              <div>
                <p className="label-md text-on-surface-variant">Kapasite Doluluk</p>
                <p className="headline-sm font-semibold text-on-surface">
                  %{soldPercentage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e5e7eb]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e1eee3] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#09724a]" />
              </div>
              <div>
                <p className="label-md text-on-surface-variant">Kalan Bilet</p>
                <p className="headline-sm font-semibold text-on-surface">
                  {event.available_tickets || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Etkinlik Hakkında</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.description && (
                <div>
                  <h3 className="body-md font-medium text-on-surface mb-2">Açıklama</h3>
                  <p className="text-[14px] text-[#666d80]">{event.description}</p>
                </div>
              )}
              {event.short_description && (
                <div>
                  <h3 className="body-md font-medium text-on-surface mb-2">Kısa Açıklama</h3>
                  <p className="text-[14px] text-[#666d80]">{event.short_description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Bilet Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="label-md text-on-surface-variant">Bilet Fiyatı</p>
                  <p className="title-lg font-semibold text-on-surface">
                    {event.ticket_price ? formatCurrency(event.ticket_price) : "Ücretsiz"}
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Toplam Bilet</p>
                  <p className="title-lg font-semibold text-on-surface">
                    {event.total_tickets || "Belirtilmemiş"}
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Min. Sipariş</p>
                  <p className="title-lg font-semibold text-on-surface">
                    {event.min_tickets_per_order || 1} bilet
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Max. Sipariş</p>
                  <p className="title-lg font-semibold text-on-surface">
                    {event.max_tickets_per_order || "Sınırsız"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Tarih ve Saat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-on-surface-variant mt-0.5" />
                <div>
                  <p className="label-md text-on-surface-variant">Başlangıç</p>
                  <p className="body-md font-medium text-on-surface">
                    {formatDate(event.start_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-on-surface-variant mt-0.5" />
                <div>
                  <p className="label-md text-on-surface-variant">Bitiş</p>
                  <p className="body-md font-medium text-on-surface">
                    {formatDate(event.end_date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Konum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-on-surface-variant mt-0.5" />
                <div>
                  <p className="body-md font-medium text-on-surface">
                    {event.venue?.name}
                  </p>
                  <p className="label-md text-on-surface-variant">
                    {event.venue?.city}
                    {event.venue?.district && `, ${event.venue?.district}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Organizasyon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-on-surface-variant mt-0.5" />
                <div>
                  <p className="body-md font-medium text-on-surface">
                    {event.organization?.name}
                  </p>
                  {event.organization?.city && (
                    <p className="label-md text-on-surface-variant">
                      {event.organization.city}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-on-surface-variant mt-0.5" />
                <div>
                  <p className="body-md font-medium text-on-surface">
                    {event.category?.name}
                  </p>
                  {event.category?.description && (
                    <p className="label-md text-on-surface-variant">
                      {event.category.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {event.is_featured && (
            <Card className="border-[#09724a] bg-[#e1eee3]">
              <CardContent className="p-4">
                <p className="text-[14px] font-medium text-[#09724a]">
                  ⭐ Öne Çıkan Etkinlik
                </p>
                <p className="text-[12px] text-[#09724a] mt-1">
                  Bu etkinlik ana sayfada gösteriliyor
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
