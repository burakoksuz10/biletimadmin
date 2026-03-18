"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
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
  organizationSchema,
  type OrganizationFormValues,
} from "@/lib/validations/organization.schema";
import { organizationsService } from "@/lib/api/services";
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from "@/lib/api/types/biletleme.types";

interface OrganizationFormProps {
  organization?: Organization;
  onSuccess?: (organization: Organization) => void;
  onCancel?: () => void;
}

export function OrganizationForm({
  organization,
  onSuccess,
  onCancel,
}: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!organization;

  // Use the same schema for both create and update (name is always required for display)
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      address: organization?.address || "",
      phone: organization?.phone || "",
      email: organization?.email || "",
      website: organization?.website || "",
      city: organization?.city || "",
      country: organization?.country || "",
    },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clean up empty strings to null for API compatibility
      const cleanedValues: CreateOrganizationRequest | UpdateOrganizationRequest = {
        name: values.name,
        description: values.description || null,
        address: values.address || null,
        phone: values.phone || null,
        email: values.email || null,
        website: values.website || null,
        city: values.city || null,
        country: values.country || null,
      };

      let result: Organization;

      if (isEditing && organization) {
        result = await organizationsService.update(organization.id, cleanedValues);
      } else {
        result = await organizationsService.create(cleanedValues as CreateOrganizationRequest);
      }

      onSuccess?.(result);
    } catch (err: any) {
      console.error("Failed to save organization:", err);
      
      // Handle validation errors from API
      if (err?.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          if (field in form.getValues()) {
            form.setError(field as keyof OrganizationFormValues, {
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

        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizatör Adı *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: BKM"
                  error={!!form.formState.errors.name}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Organizatör hakkında açıklama"
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

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Input
                  placeholder="Organizatör adresi"
                  error={!!form.formState.errors.address}
                  {...field}
                  value={field.value ?? ""}
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
                    value={field.value ?? ""}
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
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#0d0d12] dark:text-[#f9fafb]">
            İletişim Bilgileri
          </h3>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+90 212 123 4567"
                    error={!!form.formState.errors.phone}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="info@ornek.com"
                    error={!!form.formState.errors.email}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.ornek.com"
                    error={!!form.formState.errors.website}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <Building2 className="mr-2 h-4 w-4" />
                {isEditing ? "Organizatörü Güncelle" : "Organizatör Oluştur"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
