"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Building2, Loader2, Upload, X, UserPlus, Users } from "lucide-react";
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
import {
  organizationSchema,
  type OrganizationFormValues,
} from "@/lib/validations/organization.schema";
import { organizationsService, usersService } from "@/lib/api/services";
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest, BackendUser } from "@/lib/api/types/biletleme.types";

interface OrganizationFormProps {
  organization?: Organization;
  onSuccess?: (organization: Organization) => void;
  onCancel?: () => void;
}

type OperatorSelectionType = "none" | "existing" | "new";

export function OrganizationForm({
  organization,
  onSuccess,
  onCancel,
}: OrganizationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    organization?.logo_path || null
  );
  const [removeLogo, setRemoveLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Operator selection states
  const [operatorType, setOperatorType] = useState<OperatorSelectionType>(
    organization?.user ? "existing" : "none"
  );
  const [operators, setOperators] = useState<BackendUser[]>([]);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    organization?.user?.id || null
  );

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
          const data = await usersService.getByRole("org-admins");
          setOperators(data);
        } catch (error) {
          console.error("Failed to load org-admins:", error);
        } finally {
          setIsLoadingOperators(false);
        }
      };

      loadOperators();
    }
  }, [operatorType, operators.length]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Sadece resim dosyaları yüklenebilir");
        return;
      }
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Logo dosyası en fazla 2MB olabilir");
        return;
      }

      setLogoFile(file);
      setRemoveLogo(false);
      setError(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: OrganizationFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate new operator fields if creating new operator
      if (operatorType === "new") {
        if (!newOperator.name || !newOperator.email || !newOperator.password) {
          setError("Yeni organizatör yöneticisi için tüm alanları doldurun");
          setIsLoading(false);
          return;
        }
      }

      // Use FormData when there's a logo file
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description) formData.append("description", values.description);
      if (values.tax_number) formData.append("tax_number", values.tax_number);
      if (values.tax_administration) formData.append("tax_administration", values.tax_administration);
      if (values.city) formData.append("city", values.city);
      if (values.district) formData.append("district", values.district);
      if (values.address) formData.append("address", values.address);
      if (values.phone) formData.append("phone", values.phone);
      if (values.website) formData.append("website", values.website);

      // Handle operator selection
      if (operatorType === "existing" && selectedOperatorId) {
        formData.append("operator_id", selectedOperatorId.toString());
      } else if (operatorType === "new") {
        // Send admin fields directly with organization creation
        formData.append("admin_name", newOperator.name);
        formData.append("admin_email", newOperator.email);
        formData.append("admin_password", newOperator.password);
      }

      // Add logo file if selected
      if (logoFile) {
        formData.append("logo_path", logoFile);
      }

      // If editing and logo was removed, send empty value
      if (isEditing && removeLogo && !logoFile) {
        formData.append("logo_path", "");
      }

      // For PUT/PATCH via POST with _method override (Laravel convention)
      if (isEditing) {
        formData.append("_method", "PUT");
      }

      let result: Organization;

      if (isEditing && organization) {
        result = await organizationsService.update(organization.id, formData);
      } else {
        result = await organizationsService.create(formData);
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
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl body-md">
            {error}
          </div>
        )}

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="label-md text-on-surface">
            Logo
          </label>
          <div className="flex items-center gap-4">
            {/* Logo Preview */}
            <div className="relative">
              {logoPreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-outline/40 bg-surface-high">
                  <Image
                    src={logoPreview}
                    alt="Logo önizleme"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center hover:bg-danger/90 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-outline/40 bg-surface-high flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-on-surface-variant" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                Logo Yükle
              </Button>
              <p className="body-sm text-on-surface-variant">
                PNG, JPG, WEBP. Maks. 2MB
              </p>
            </div>
          </div>
        </div>

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

        {/* Operator Selection */}
        <div className="space-y-3">
          <label className="label-md text-on-surface">
            Organizatör Yöneticisi
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
                  Organizatör yöneticileri yükleniyor...
                </div>
              ) : operators.length > 0 ? (
                <Select
                  value={selectedOperatorId?.toString() || ""}
                  onValueChange={(value) => setSelectedOperatorId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Organizatör yöneticisi seçin" />
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
                  Kayıtlı organizatör yöneticisi bulunamadı
                </p>
              )}
            </div>
          )}

          {/* New Operator Form */}
          {operatorType === "new" && (
            <div className="space-y-3 p-4 border border-outline/30 rounded-xl bg-surface-high">
              <h4 className="body-md font-semibold text-on-surface">
                Yeni Organizatör Yöneticisi Bilgileri
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
                  Rol: Org-Admin (sabit)
                </p>
              </div>
            </div>
          )}
        </div>

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
          <h3 className="body-md font-semibold text-on-surface">
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
