"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatingPlanEditor } from "@/components/stages/seating-plan-editor";
import { stagesService, type ApiStage } from "@/lib/api/services";

export default function StageSeatingPlanPage() {
  const params = useParams();
  const router = useRouter();
  const stageId = parseInt(params.id as string);

  const [stage, setStage] = useState<ApiStage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Stage'in hangi mekana ait olduğunu bulmak için stages listesinden almalıyız
  // Şimdilik venue_id'yi URL'den almayı deneyelim veya stages service'den
  const [venueId, setVenueId] = useState<number | null>(null);

  useEffect(() => {
    const loadStage = async () => {
      try {
        // İlk olarak tüm mekanların salonlarını kontrol ederek bulmalıyız
        // Bu geçici bir çözüm, ileride daha optimize edilebilir
        const { venuesService } = await import("@/lib/api/services");
        const venues = await venuesService.getAll();

        for (const venue of venues.data) {
          try {
            const venueStages = await stagesService.getByVenue(venue.id);
            const foundStage = venueStages.find((s: ApiStage) => s.id === stageId);
            if (foundStage) {
              setStage(foundStage);
              setVenueId(venue.id);
              break;
            }
          } catch {
            continue;
          }
        }
      } catch (error) {
        console.error("Failed to load stage:", error);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadStage();
  }, [stageId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#09724a]" />
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="text-center py-12">
        <p>Salon bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/venues/${stage.venue_id}/stages`}>
          <Button variant="ghost" size="small" className="h-8 w-8 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="headline-lg font-semibold text-on-surface">
            {stage.name} - Oturma Planı
          </h1>
          <p className="body-md text-on-surface-variant">
            Kapasite: {stage.capacity.toLocaleString()} | Koltuk Sayısı: {stage.seats_count?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Editor */}
      {venueId && (
        <SeatingPlanEditor
          venueId={venueId}
          stageId={stageId}
          stageName={stage.name}
          onSave={() => {
            // Kayıt başarılı, refresh yap
            window.location.reload();
          }}
          onCancel={() => router.back()}
        />
      )}
    </div>
  );
}
