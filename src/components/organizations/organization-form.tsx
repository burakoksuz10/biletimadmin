"use client";

import { useState } from "react";
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

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      tax_number: organization?.tax_number || "",
      tax_administration: organization?.tax_administration || "",
      city: organization?.city || "",
      district: organization?.district || "",
      address: organization?.address || "",
      phone: organization?.phone || "",
      website: organization?.website || "",
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
        tax_number: values.tax_number || null,
        tax_administration: values.tax_administration || null,
        city: values.city || null,
        district: values.district || null,
        address: values.address || null,
        phone: values.phone || null,
        website: values.website || null,
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
      if (err?.errors) {
        const apiErrors = err.errors;
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

        {/* Tax Information */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tax_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vergi Numarası</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: 1234567890"
                    error={!!form.formState.errors.tax_number}
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
            name="tax_administration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vergi Dairesi</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: Beşiktaş Vergi Dairesi"
                    error={!!form.formState.errors.tax_administration}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        {/* City and District */}
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
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlçe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Örn: Beşiktaş"
                    error={!!form.formState.errors.district}
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
