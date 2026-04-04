// Zod Validation Schemas for Events
// Matches backend API structure

import { z } from "zod";

// Event status enum matching backend
export const eventStatuses = ["draft", "published", "cancelled", "completed", "ongoing"] as const;
export type EventStatus = (typeof eventStatuses)[number];

// Base event schema matching backend CreateEventRequest
export const eventSchema = z.object({
  title: z
    .string()
    .min(3, "Etkinlik adı en az 3 karakter olmalıdır")
    .max(255, "Etkinlik adı en fazla 255 karakter olabilir"),
  description: z.string().optional().nullable(),
  short_description: z.string().max(255, "Kısa açıklama en fazla 255 karakter olabilir").optional().nullable(),
  organization_id: z.number({
    message: "Organizasyon seçilmelidir",
  }).min(1, "Organizasyon seçilmelidir"),
  venue_id: z.number({
    message: "Mekan seçilmelidir",
  }).min(1, "Mekan seçilmelidir"),
  category_id: z.number({
    message: "Kategori seçilmelidir",
  }).min(1, "Kategori seçilmelidir"),
  start_date: z.string().min(1, "Başlangıç tarihi gereklidir"),
  end_date: z.string().min(1, "Bitiş tarihi gereklidir"),
  featured_image: z.string().url("Geçerli bir URL giriniz").optional().nullable().or(z.literal("")),
  ticket_price: z.number().min(0, "Fiyat 0 veya daha büyük olmalıdır").optional().nullable(),
  total_tickets: z.number().min(1, "Toplam bilet sayısı en az 1 olmalıdır").optional().nullable(),
  min_tickets_per_order: z.number().min(1, "Minimum bilet sayısı en az 1 olmalıdır").optional().nullable(),
  max_tickets_per_order: z.number().min(1, "Maksimum bilet sayısı en az 1 olmalıdır").optional().nullable(),
  is_featured: z.boolean().optional(),
});

// Create event schema - all required fields
export const createEventSchema = eventSchema;

// Update event schema - all fields optional
export const updateEventSchema = eventSchema.partial();

// Status update schema
export const eventStatusSchema = z.object({
  status: z.enum(eventStatuses),
});

// Form values type exports
export type EventFormValues = z.infer<typeof eventSchema>;
export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
export type EventStatusFormValues = z.infer<typeof eventStatusSchema>;

// Validation helper for date range
export const validateEventDates = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

// Validation helper for ticket limits
export const validateTicketLimits = (min?: number | null, max?: number | null): boolean => {
  if (min === null || min === undefined || max === null || max === undefined) return true;
  return min <= max;
};
