"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DoorOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stageSchema, type StageFormValues } from "@/lib/validations/stage.schema";
import { stagesService, type ApiStage, type CreateStageRequest, type UpdateStageRequest } from "@/lib/api/services";

interface StageFormProps {
  venueId: number;
  stage?: ApiStage;
  onSuccess?: (stage: ApiStage) => void;
  onCancel?: () => void;
}

const SEATING_TYPE_OPTIONS = [
  { value: "seated", label: "Oturmalı" },
  { value: "standing", label: "Ayakta" },
  { value: "mixed", label: "Karma" },
] as const;

export function StageForm({ venueId, stage, onSuccess, onCancel }: StageFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!stage;

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: stage?.name || "",
      capacity: stage?.capacity || 0,
      seating_type: stage?.seating_type || "seated",
      gate_info: stage?.gate_info || "",
    },
  });

  const onSubmit = async (values: StageFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const cleanedValues: CreateStageRequest | UpdateStageRequest = {
        name: values.name,
        capacity: values.capacity,
        seating_type: values.seating_type,
        gate_info: values.gate_info || null,
      };

      let result: ApiStage;

      if (isEditing && stage) {
        result = await stagesService.update(venueId, stage.id, cleanedValues);
      } else {
        result = await stagesService.create(venueId, cleanedValues as CreateStageRequest);
      }

      onSuccess?.(result);
    } catch (err: any) {
      console.error("Failed to save stage:", err?.message || err);

      // Handle validation errors from backend
      if (err?.errors) {
        const apiErrors = err.errors;
        Object.keys(apiErrors).forEach((field) => {
          if (field in form.getValues()) {
            form.setError(field as keyof StageFormValues, {
              type: "server",
              message: Array.isArray(apiErrors[field])
                ? apiErrors[field][0]
                : apiErrors[field],
            });
          }
        });
      }

      const errorMessage = err?.message || (isEditing
        ? "Salon güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
        : "Salon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Salon Adı */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salon Adı *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: Ana Salon"
                  error={!!form.formState.errors.name}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kapasite */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salon Kapasitesi *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Örn: 500"
                  error={!!form.formState.errors.capacity}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Salon Yerleşim Tipi */}
        <FormField
          control={form.control}
          name="seating_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salon Yerleşim Tipi *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger
                    className={form.formState.errors.seating_type ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Yerleşim tipi seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SEATING_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kapı Bilgisi */}
        <FormField
          control={form.control}
          name="gate_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapı Bilgisi</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: A Kapısı"
                  error={!!form.formState.errors.gate_info}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
          <Button
            type="submit"
            className="bg-[#09724a] hover:bg-[#066d41]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Güncelleniyor..." : "Oluşturuluyor..."}
              </>
            ) : (
              <>
                <DoorOpen className="mr-2 h-4 w-4" />
                {isEditing ? "Salonu Güncelle" : "Salon Oluştur"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
