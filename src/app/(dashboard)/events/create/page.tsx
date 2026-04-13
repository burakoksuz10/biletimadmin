"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { EventForm } from "@/components/events/event-form";
import type { Event } from "@/lib/api/types/biletleme.types";

export default function CreateEventPage() {
  const router = useRouter();

  const handleSuccess = (event: Event) => {
    // Redirect to event detail page
    router.push(`/events/${event.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="headline-lg font-semibold text-on-surface">Yeni Etkinlik Oluştur</h1>
        <p className="body-md text-on-surface-variant mt-1">
          Yeni bir etkinlik oluşturun ve detaylarını girin
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-[#e5e7eb]">
        <CardContent className="p-6">
          <EventForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
