"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Loader2, UserPlus, Users } from "lucide-react";
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
import { venueSchema } from "@/lib/validations/venue.schema";
import type { VenueFormValues } from "@/lib/validations/venue.schema";
import { venuesService, usersService } from "@/lib/api/services";
import type { Venue, CreateVenueRequest, UpdateVenueRequest, BackendUser } from "@/lib/api/types/biletleme.types";

interface VenueFormProps {
  venue?: Venue;
  onSuccess?: (venue: Venue) => void;
  onCancel?: () => void;
}

type OperatorSelectionType = "none" | "existing" | "new";

export function VenueForm({ venue, onSuccess, onCancel }: VenueFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Operator selection states
  const [operatorType, setOperatorType] = useState<OperatorSelectionType>(
    venue?.user ? "existing" : "none"
  );
  const [operators, setOperators] = useState<BackendUser[]>([]);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    venue?.user?.id || null
  );

  const isEditing = !!venue;

  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: venue?.name || "",
      city: venue?.city || "",
      district: venue?.district || "",
      address: venue?.address || "",
      map_url: venue?.map_url || null,
      description: venue?.description || "",
      is_active: true,
    },
  });

  // New operator form state
  const [newOperator, setNewOperator] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Load operators when switching to "existing" mode or when editing
  useEffect(() => {
    if (operatorType === "existing" && operators.length === 0) {
      const loadOperators = async () => {
        try {
          setIsLoadingOperators(true);
          const data = await usersService.getByRole("operators");
          setOperators(data);
        } catch (error) {
          console.error("Failed to load operators:", error);
        } finally {
          setIsLoadingOperators(false);
        }
      };

      loadOperators();
    }
  }, [operatorType, operators.length]);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate new operator fields if creating new operator
      if (operatorType === "new") {
        if (!newOperator.name || !newOperator.email || !newOperator.password) {
          setError("Yeni mekan yöneticisi için tüm alanları doldurun");
          setIsLoading(false);
          return;
        }
      }

      const cleanedValues: CreateVenueRequest | UpdateVenueRequest = {
        name: values.name,
        city: values.city,
        district: values.district,
        address: values.address,
        map_url: values.map_url ?? null,
        description: values.description || null,
        is_active: values.is_active ?? true,
      };

      // Handle operator selection
      if (operatorType === "existing" && selectedOperatorId) {
        (cleanedValues as any).operator_id = selectedOperatorId;
      } else if (operatorType === "new") {
        // Send admin fields directly with venue creation
        (cleanedValues as any).admin_name = newOperator.name;
        (cleanedValues as any).admin_email = newOperator.email;
        (cleanedValues as any).admin_password = newOperator.password;
      }

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
        const errorMessages: string[] = [];
        Object.keys(apiErrors).forEach((field) => {
          const msg = Array.isArray(apiErrors[field])
            ? apiErrors[field][0]
            : apiErrors[field];
          if (field in form.getValues()) {
            form.setError(field as keyof VenueFormValues, {
              type: "server",
              message: msg,
            });
          } else {
            errorMessages.push(`${field}: ${msg}`);
          }
        });
        if (errorMessages.length > 0) {
          setError(errorMessages.join(", "));
          setIsLoading(false);
          return;
        }
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
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl body-md">
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

        {/* Operator Selection */}
        <div className="space-y-3">
          <label className="label-md text-on-surface">
            Mekan Yöneticisi
          </label>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={operatorType === "none" ? "primary" : "secondary"}
              size="small"
              onClick={() => setOperatorType("none")}
            >
              Seçim Yok
            </Button>
            <Button
              type="button"
              variant={operatorType === "existing" ? "primary" : "secondary"}
              size="small"
              onClick={() => setOperatorType("existing")}
            >
              <Users className="w-4 h-4 mr-1.5" />
              Kayıtlı Seç
            </Button>
            <Button
              type="button"
              variant={operatorType === "new" ? "primary" : "secondary"}
              size="small"
              onClick={() => setOperatorType("new")}
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Yeni Ekle
            </Button>
          </div>

          {/* Existing Operator Selection */}
          {operatorType === "existing" && (
            <div className="space-y-2">
              {isLoadingOperators ? (
                <div className="flex items-center gap-2 body-md text-on-surface-variant">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mekan yöneticileri yükleniyor...
                </div>
              ) : operators.length > 0 ? (
                <Select
                  value={selectedOperatorId?.toString() || ""}
                  onValueChange={(value) => setSelectedOperatorId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mekan yöneticisi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.id} value={op.id.toString()}>
                        {op.name} ({op.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="body-md text-on-surface-variant">
                  Kayıtlı mekan yöneticisi bulunamadı
                </p>
              )}
            </div>
          )}

          {/* New Operator Form */}
          {operatorType === "new" && (
            <div className="space-y-3 p-4 border border-outline/30 rounded-xl bg-surface-high">
              <h4 className="body-md font-semibold text-on-surface">
                Yeni Mekan Yöneticisi Bilgileri
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="label-sm text-on-surface-variant">
                    Ad Soyad *
                  </label>
                  <Input
                    type="text"
                    placeholder="Ad Soyad"
                    value={newOperator.name}
                    onChange={(e) => setNewOperator({ ...newOperator, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-sm text-on-surface-variant">
                    E-posta *
                  </label>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    value={newOperator.email}
                    onChange={(e) => setNewOperator({ ...newOperator, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-sm text-on-surface-variant">
                    Şifre *
                  </label>
                  <Input
                    type="password"
                    placeholder="•••••••••"
                    value={newOperator.password}
                    onChange={(e) => setNewOperator({ ...newOperator, password: e.target.value })}
                  />
                </div>
                <p className="body-sm text-on-surface-variant">
                  Rol: Operator (sabit)
                </p>
              </div>
            </div>
          )}
        </div>

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
            <FormItem className="flex items-center justify-between rounded-lg border border-outline/30 p-4">
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
                    field.value ? "bg-primary" : "bg-outline"
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
            variant="primary"
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
