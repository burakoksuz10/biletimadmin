"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { venueSchema, type VenueFormValues } from "@/lib/validations/venue.schema";
import { venuesService } from "@/lib/api/services";
import { organizationsService } from "@/lib/api/services";
import type { Venue, Organization } from "@/lib/api/types/biletleme.types";

interface VenueFormProps {
  venue?: Venue;
  onSuccess?: (venue: Venue) => void;
  onCancel?: () => void;
}

export function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);

  const isEditing = !!venue;

  // Load organizations
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoadingOrgs(true);
        const data = await organizationsService.getAll();
        setOrganizations(data);
      } catch (error) {
        console.error("Failed to load organizations:", error);
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    loadOrganizations();
  }, []);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      organization_id: venue?.organization_id || 0,
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

      // Convert null to undefined for API compatibility
      const apiValues = {
        ...values,
        latitude: values.latitude ?? undefined,
        longitude: values.longitude ?? undefined,
        description: values.description ?? undefined,
      };

      let result: Venue;

      if (isEditing && venue) {
        result = await venuesService.update(venue.id, apiValues);
      } else {
        result = await venuesService.create(apiValues);
      }

      onSuccess?.(result);
    } catch (error) {
      console.error("Failed to save venue:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Organization Selection */}
        <FormField
          control={form.control}
          name="organization_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizasyon</FormLabel>
              <Select
                disabled={isLoadingOrgs || isEditing}
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger error={!!form.formState.errors.organization_id}>
                    <SelectValue placeholder="Organizasyon seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingOrgs ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-[#666d80]" />
                    </div>
                  ) : (
                    organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id.toString()}>
                        {org.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Venue Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mekan Adı</FormLabel>
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
              <FormLabel>Adres</FormLabel>
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
                <FormLabel>Şehir</FormLabel>
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
                <FormLabel>Ülke</FormLabel>
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
              <FormLabel>Kapasite</FormLabel>
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
