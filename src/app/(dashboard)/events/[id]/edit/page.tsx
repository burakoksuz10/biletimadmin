"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
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
    router.push(`/events/${updatedEvent.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="relative min-h-[600px] flex items-center justify-center">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />

        {/* Loading state with glass card */}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-glass shadow-glow mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <p className="body-lg text-on-surface-variant">Etkinlik yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="relative min-h-[600px] flex items-center justify-center">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />

        {/* Error state with glass card */}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/10 backdrop-blur-glass mb-4">
            <Sparkles className="w-8 h-8 text-danger" />
          </div>
          <p className="body-lg text-danger mb-6">{error || "Etkinlik bulunamadı"}</p>
          <Button
            variant="outline"
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
    <div className="relative min-h-screen">
      {/* Atmospheric mesh gradient background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 space-y-8 py-6 animate-fade-in">
        {/* Page Header with glass effect */}
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl backdrop-blur-glass bg-white/40 hover:bg-white/60 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </Button>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-high/60 backdrop-blur-glass mb-3">
              <span className="label-sm text-primary uppercase tracking-wider">
                Etkinlik Düzenleme
              </span>
            </div>
            <h1 className="display-sm text-on-surface tracking-tight">
              Etkinliği Düzenle
            </h1>
            <p className="body-lg text-on-surface-variant mt-2 max-w-xl">
              {event.title}
            </p>
          </div>
        </div>

        {/* Form Container - Glassmorphism card */}
        <div className="relative">
          {/* Ambient glow behind form */}
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl blur-2xl" />

          {/* Main form card */}
          <div className="relative rounded-2xl bg-white/75 dark:bg-surface/75 backdrop-blur-glass shadow-glow overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />

            {/* Form content */}
            <div className="relative z-10 p-8">
              <EventForm
                event={event}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
