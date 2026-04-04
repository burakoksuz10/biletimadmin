"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { venueSchema, type VenueFormValues } from "@/lib/validations/venue.schema";
import { venuesService } from "@/lib/api/services";
import type { Venue, CreateVenueRequest, UpdateVenueRequest } from "@/lib/api/types/biletleme.types";

interface VenueFormProps {
  venue?: Venue;
  onSuccess?: (venue: Venue) => void;
  onCancel?: () => void;
}

export function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!venue;

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: venue?.name || "",
      city: venue?.city || "",
      district: venue?.district || "",
      address: venue?.address || "",
      map_url: venue?.map_url || null,
      description: venue?.description || "",
      is_active: venue?.is_active ?? true,
    },
  });

  const onSubmit = async (values: VenueFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const cleanedValues: CreateVenueRequest | UpdateVenueRequest = {
        name: values.name,
        city: values.city,
        district: values.district,
        address: values.address,
        map_url: values.map_url ?? null,
        description: values.description || null,
        is_active: values.is_active,
      };

      let result: Venue;

      if (isEditing && venue) {
        result = await venuesService.update(venue.id, cleanedValues);
      } else {
        result = await venuesService.create(cleanedValues as CreateVenueRequest);
      }

      onSuccess?.(result);
    } catch (err: any) {
      console.error("Failed to save venue:", JSON.stringify(err, null, 2));
      console.error("Error details:", {
        message: err?.message,
        status: err?.status,
        data: err?.data,
        errors: err?.errors,
        response: err?.response?.data,
      });

      if (err?.errors) {
        const apiErrors = err.errors;
        Object.keys(apiErrors).forEach((field) => {
          if (field in form.getValues()) {
            form.setError(field as keyof VenueFormValues, {
              type: "server",
              message: Array.isArray(apiErrors[field])
                ? apiErrors[field][0]
                : apiErrors[field],
            });
          }
        });
      }

      const errorMessage = err?.message || "Bir hata oluştu";
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

        {/* Mekan Adı */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mekan Adı *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: Harbiye Açık Hava Tiyatrosu"
                  error={!!form.formState.errors.name}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* İl ve İlçe */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İl *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: İstanbul"
                    error={!!form.formState.errors.city}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlçe *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: Beşiktaş"
                    error={!!form.formState.errors.district}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Açık Adres */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açık Adres *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mekanın tam adresi"
                  error={!!form.formState.errors.address}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Map URL */}
        <FormField
          control={form.control}
          name="map_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harita URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://maps.google.com/..."
                  error={!!form.formState.errors.map_url}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mekan Açıklaması */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mekan Açıklaması</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mekan hakkında açıklama"
                  className="min-h-[100px]"
                  error={!!form.formState.errors.description}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Durum (is_active) */}
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-[#e5e7eb] dark:border-[#374151] p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Durum</FormLabel>
              </div>
              <FormControl>
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    field.value ? "bg-[#09724a]" : "bg-[#d1d5db] dark:bg-[#4b5563]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      field.value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </FormControl>
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
                <MapPin className="mr-2 h-4 w-4" />
                {isEditing ? "Mekanı Güncelle" : "Mekan Oluştur"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
