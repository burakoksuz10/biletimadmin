// Zod Validation Schemas for Events

import { z } from "zod";

export const ticketTypeSchema = z.object({
  name: z.string().min(1, "Bilet tipi adı gereklidir"),
  description: z.string().optional(),
  price: z.number().min(0, "Fiyat 0 veya daha büyük olmalıdır"),
  quantity: z.number().min(1, "Miktar en az 1 olmalıdır"),
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional(),
  minPurchase: z.number().min(1).optional(),
  maxPurchase: z.number().min(1).optional(),
});

export const createEventSchema = z.object({
  name: z.string().min(3, "Etkinlik adı en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  dateTime: z.string().min(1, "Etkinlik tarihi gereklidir"),
  location: z.string().min(1, "Konum gereklidir"),
  venue: z.string().optional(),
  category: z.string().optional(),
  totalTickets: z.number().min(1, "Toplam bilet sayısı en az 1 olmalıdır"),
  ticketTypes: z.array(ticketTypeSchema).min(1, "En az bir bilet tipi eklemelisiniz"),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string(),
  status: z.enum(["published", "pending", "cancelled", "draft", "rejected"]).optional(),
});

export type UpdateEventFormValues = z.infer<typeof updateEventSchema>;
