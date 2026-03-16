// Zod Validation Schema for Organizations

import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(2, "Organizasyon adı en az 2 karakter olmalıdır")
    .max(255, "Organizasyon adı en fazla 255 karakter olabilir"),
  description: z
    .string()
    .max(1000, "Açıklama en fazla 1000 karakter olabilir")
    .optional()
    .nullable(),
  address: z
    .string()
    .max(500, "Adres en fazla 500 karakter olabilir")
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(20, "Telefon numarası en fazla 20 karakter olabilir")
    .optional()
    .nullable(),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .max(255, "E-posta en fazla 255 karakter olabilir")
    .optional()
    .nullable(),
  website: z
    .string()
    .url("Geçerli bir website adresi girin")
    .max(255, "Website en fazla 255 karakter olabilir")
    .optional()
    .nullable(),
  city: z
    .string()
    .max(100, "Şehir en fazla 100 karakter olabilir")
    .optional()
    .nullable(),
  country: z
    .string()
    .max(100, "Ülke en fazla 100 karakter olabilir")
    .optional()
    .nullable(),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

// Schema for updating organizations (all fields optional)
export const updateOrganizationSchema = organizationSchema.partial();

export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;
