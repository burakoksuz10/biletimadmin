"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { customersService } from "@/lib/api/services";
import type { Customer, CustomerStatus, CustomerSegment } from "@/types/customer.types";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setIsLoading(true);
        const data = await customersService.getById(customerId);
        setCustomer(data);
      } catch (err: any) {
        console.error("Müşteri yüklenirken hata:", err);
        setError("Müşteri bulunamadı");
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomer();
  }, [customerId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: (formData.get("city") as string) || undefined,
        country: (formData.get("country") as string) || undefined,
        address: (formData.get("address") as string) || undefined,
        status: formData.get("status") as CustomerStatus,
        customer_segment: (formData.get("customer_segment") as CustomerSegment) || undefined,
      };

      await customersService.update(customerId, data);

      setSuccessMessage("Müşteri başarıyla güncellendi.");
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err: any) {
      console.error("Müşteri güncellenirken hata:", err);
      setError(err?.message || "Bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#09724a] mx-auto mb-4" />
          <p className="text-on-surface-variant">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-[#df1c41] mb-4">Müşteri bulunamadı</p>
          <Link href="/customers">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/customers/${customerId}`}>
          <Button variant="ghost" size="small" className="h-8 w-8 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="headline-lg text-on-surface">Müşteriyi Düzenle</h1>
          <p className="body-md text-on-surface-variant mt-1">
            {customer.name} - Bilgileri güncelleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl body-md mb-6">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-xl body-md mb-6">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  Ad Soyad *
                </label>
                <Input
                  name="name"
                  defaultValue={customer.name}
                  required
                  placeholder="Ad Soyad"
                />
              </div>
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  E-posta *
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={customer.email}
                  required
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="label-md text-on-surface-variant mb-2 block">
                Telefon
              </label>
              <Input
                name="phone"
                defaultValue={customer.phone || ""}
                placeholder="+90 555 123 45 67"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  Şehir
                </label>
                <Input
                  name="city"
                  defaultValue={customer.city || ""}
                  placeholder="İstanbul"
                />
              </div>
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  Ülke
                </label>
                <Input
                  name="country"
                  defaultValue={customer.country || ""}
                  placeholder="Türkiye"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="label-md text-on-surface-variant mb-2 block">
                Adres
              </label>
              <Textarea
                name="address"
                defaultValue={customer.address || ""}
                placeholder="Tam adres"
                className="min-h-[100px]"
              />
            </div>

            {/* Status and Segment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  Durum
                </label>
                <Select name="status" defaultValue={customer.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="suspended">Askıya Alındı</SelectItem>
                    <SelectItem value="banned">Yasaklandı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="label-md text-on-surface-variant mb-2 block">
                  Müşteri Segmenti
                </label>
                <Select name="customer_segment" defaultValue={customer.customer_segment || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Normal</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="new">Yeni</SelectItem>
                    <SelectItem value="at_risk">Riskli</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-outline/20">
              <Link href={`/customers/${customerId}`}>
                <Button variant="secondary" disabled={isSaving}>
                  İptal
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#09724a] hover:bg-[#066d41]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Kaydet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
