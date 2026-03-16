// Zod Validation Schema for Venues

import { z } from "zod";

export const venueSchema = z.object({
  organization_id: z
    .number()
    .min(1, "Organizatör seçimi zorunludur"),
  name: z
    .string()
    .min(2, "Mekan adı en az 2 karakter olmalıdır")
    .max(255, "Mekan adı en fazla 255 karakter olabilir"),
  address: z
    .string()
    .min(2, "Adres en az 2 karakter olmalıdır")
    .max(500, "Adres en fazla 500 karakter olabilir"),
  city: z
    .string()
    .min(2, "Şehir en az 2 karakter olmalıdır")
    .max(100, "Şehir en fazla 100 karakter olabilir"),
  country: z
    .string()
    .min(2, "Ülke en az 2 karakter olmalıdır")
    .max(100, "Ülke en fazla 100 karakter olabilir"),
  capacity: z
    .number()
    .min(1, "Kapasite en az 1 olmalıdır")
    .max(1000000, "Kapasite en fazla 1.000.000 olabilir"),
  latitude: z
    .number()
    .min(-90, "Enlem -90 ile 90 arasında olmalıdır")
    .max(90, "Enlem -90 ile 90 arasında olmalıdır")
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, "Boylam -180 ile 180 arasında olmalıdır")
    .max(180, "Boylam -180 ile 180 arasında olmalıdır")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(2000, "Açıklama en fazla 2000 karakter olabilir")
    .optional()
    .nullable(),
});

export type VenueFormValues = z.infer<typeof venueSchema>;

// Schema for updating venues (all fields optional except organization_id)
export const updateVenueSchema = venueSchema.partial().required({ organization_id: true });

export type UpdateVenueFormValues = z.infer<typeof updateVenueSchema>;
