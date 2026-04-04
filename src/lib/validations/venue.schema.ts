// Zod Validation Schema for Venues

import { z } from "zod";

export const venueSchema = z.object({
  name: z
    .string()
    .min(2, "Mekan adı en az 2 karakter olmalıdır")
    .max(255, "Mekan adı en fazla 255 karakter olabilir"),
  city: z
    .string()
    .min(2, "İl en az 2 karakter olmalıdır")
    .max(100, "İl en fazla 100 karakter olabilir"),
  district: z
    .string()
    .min(2, "İlçe en az 2 karakter olmalıdır")
    .max(100, "İlçe en fazla 100 karakter olabilir"),
  address: z
    .string()
    .min(2, "Açık adres en az 2 karakter olmalıdır")
    .max(500, "Açık adres en fazla 500 karakter olabilir"),
  map_url: z
    .string()
    .url("Geçerli bir URL giriniz")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(2000, "Açıklama en fazla 2000 karakter olabilir")
    .optional()
    .nullable(),
  is_active: z
    .boolean(),
});

export type VenueFormValues = z.infer<typeof venueSchema>;

// Schema for updating venues (all fields optional)
export const updateVenueSchema = venueSchema.partial();

export type UpdateVenueFormValues = z.infer<typeof updateVenueSchema>;

