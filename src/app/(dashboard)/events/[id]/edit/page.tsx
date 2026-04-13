"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/events/event-form";
import { useEvent } from "@/lib/hooks/use-events";
import type { Event } from "@/lib/api/types/biletleme.types";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);
  
  const { event, loading, error } = useEvent(eventId);

  const handleSuccess = (updatedEvent: Event) => {
    // Redirect to event detail page
    router.push(`/events/${updatedEvent.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#09724a]" />
          <p className="body-md text-on-surface-variant mt-2">Etkinlik yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="body-md text-[#df1c41]">{error || "Etkinlik bulunamadı"}</p>
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="headline-lg font-semibold text-on-surface">Etkinliği Düzenle</h1>
          <p className="body-md text-on-surface-variant mt-1">
            {event.title}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-6">
          <EventForm 
            event={event} 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
