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
      address: venue?.address || "",
      city: venue?.city || "",
      country: venue?.country || "",
      capacity: venue?.capacity || 0,
      latitude: venue?.latitude || null,
      longitude: venue?.longitude || null,
      description: venue?.description || "",
    },
  });

  const onSubmit = async (values: VenueFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clean up values for API compatibility
      const cleanedValues: CreateVenueRequest | UpdateVenueRequest = {
        name: values.name,
        address: values.address,
        city: values.city,
        country: values.country,
        capacity: values.capacity,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
        description: values.description || null,
      };

      let result: Venue;

      if (isEditing && venue) {
        result = await venuesService.update(venue.id, cleanedValues);
      } else {
        result = await venuesService.create(cleanedValues as CreateVenueRequest);
      }

      onSuccess?.(result);
    } catch (err: any) {
      console.error("Failed to save venue:", err);
      
      // Handle validation errors from API
      if (err?.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
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
      
      // Handle general error message
      const errorMessage = err?.response?.data?.message || err?.message || "Bir hata oluştu";
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

        {/* Venue Name */}
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

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres *</FormLabel>
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

        {/* City and Country */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şehir *</FormLabel>
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ülke *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: Türkiye"
                    error={!!form.formState.errors.country}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasite *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Mekanın kapasitesi"
                  error={!!form.formState.errors.capacity}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Coordinates (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enlem (Opsiyonel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Örn: 41.046488"
                    error={!!form.formState.errors.latitude}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Boylam (Opsiyonel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="Örn: 28.994238"
                    error={!!form.formState.errors.longitude}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : null)
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama (Opsiyonel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mekan hakkında açıklama"
                  className="min-h-[100px]"
                  error={!!form.formState.errors.description}
                  {...field}
                  value={field.value ?? ""}
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
