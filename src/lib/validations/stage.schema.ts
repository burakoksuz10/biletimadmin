// Zod Validation Schema for Stages (Salonlar)

import { z } from "zod";

export const stageSchema = z.object({
  name: z
    .string()
    .min(2, "Salon adı en az 2 karakter olmalıdır")
    .max(255, "Salon adı en fazla 255 karakter olabilir"),
  capacity: z
    .number()
    .min(1, "Kapasite en az 1 olmalıdır")
    .max(100000, "Kapasite en fazla 100.000 olabilir"),
  seating_type: z.enum(["seated", "standing", "mixed"]),
  gate_info: z
    .string()
    .max(255, "Kapı bilgisi en fazla 255 karakter olabilir")
    .optional()
    .nullable(),
});

export type StageFormValues = z.infer<typeof stageSchema>;

// Schema for updating stages (all fields optional)
export const updateStageSchema = stageSchema.partial();

export type UpdateStageFormValues = z.infer<typeof updateStageSchema>;
