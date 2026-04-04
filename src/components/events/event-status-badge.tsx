"use client";

import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/api/types/biletleme.types";

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const statusConfig: Record<EventStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  draft: {
    label: "Taslak",
    variant: "neutral",
  },
  published: {
    label: "Yayınlandı",
    variant: "success",
  },
  cancelled: {
    label: "İptal Edildi",
    variant: "danger",
  },
  completed: {
    label: "Tamamlandı",
    variant: "info",
  },
  ongoing: {
    label: "Devam Ediyor",
    variant: "warning",
  },
};

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
