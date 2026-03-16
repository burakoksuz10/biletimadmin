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
import { organizationSchema, type OrganizationFormValues } from "@/lib/validations/organization.schema";
import { organizationsService } from "@/lib/api/services";
import type { Organization } from "@/lib/api/types/biletleme.types";

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

  const isEditing = !!organization;

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

      // Convert null to undefined for API compatibility
      const apiValues = {
        ...values,
        description: values.description ?? undefined,
        address: values.address ?? undefined,
        phone: values.phone ?? undefined,
        email: values.email ?? undefined,
        website: values.website ?? undefined,
        city: values.city ?? undefined,
        country: values.country ?? undefined,
      };

      let result: Organization;

      if (isEditing && organization) {
        result = await organizationsService.update(organization.id, apiValues);
      } else {
        result = await organizationsService.create(apiValues);
      }

      onSuccess?.(result);
    } catch (error) {
      console.error("Failed to save organization:", error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizatör Adı</FormLabel>
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
              <FormLabel>Açıklama (Opsiyonel)</FormLabel>
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
              <FormLabel>Adres (Opsiyonel)</FormLabel>
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
                <FormLabel>Şehir (Opsiyonel)</FormLabel>
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
                <FormLabel>Ülke (Opsiyonel)</FormLabel>
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
          <h3 className="text-sm font-medium text-[#0d0d12]">İletişim Bilgileri</h3>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon (Opsiyonel)</FormLabel>
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
                <FormLabel>E-posta (Opsiyonel)</FormLabel>
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
                <FormLabel>Website (Opsiyonel)</FormLabel>
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
