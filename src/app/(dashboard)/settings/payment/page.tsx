"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, CreditCard, Plus, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Ödeme Ayarları
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Ödeme yöntemlerini ve yapılandırmaları yönetin
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Payment Methods - Glass card style */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="title-lg font-semibold text-on-surface">
              Ödeme Yöntemleri
            </CardTitle>
            <Button variant="secondary" size="small">
              <Plus className="w-4 h-4 mr-2" />
              Yöntem Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Stripe - Active */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-success-container/40 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="body-md font-medium text-on-surface">
                    Stripe
                  </p>
                  <Badge variant="success">Aktif</Badge>
                </div>
                <p className="label-md text-on-surface-variant mt-0.5">
                  Hesaba bağlı: test@stripe.com
                </p>
              </div>
            </div>
            <Button variant="secondary" size="small">
              Yapılandır
            </Button>
          </div>

          {/* PayPal - Inactive */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-high">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-low flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-on-surface-variant" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="body-md font-medium text-on-surface">
                    PayPal
                  </p>
                  <Badge variant="neutral">İnaktif</Badge>
                </div>
                <p className="label-md text-on-surface-variant mt-0.5">
                  Bağlı değil
                </p>
              </div>
            </div>
            <Button variant="secondary" size="small">
              Bağlan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bank Transfer - Stats card for premium feel */}
      <Card className="stats-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-secondary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Banka Transferi
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50">
            <div>
              <p className="body-md font-medium text-on-surface">
                Banka Transferini Etkinleştir
              </p>
              <p className="label-md text-on-surface-variant mt-1">
                Müşterilerin banka transferi ile ödeme yapmasına izin ver
              </p>
            </div>
            <Checkbox />
          </div>

          {/* Bank Details Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Banka Adı</Label>
                <Input
                  id="bankName"
                  placeholder="Banka adını girin"
                  defaultValue="Ziraat Bankası"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Hesap Adı</Label>
                <Input
                  id="accountName"
                  placeholder="Hesap adını girin"
                  defaultValue="Biletim Ltd."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  defaultValue="TR01 0001 2345 6789 0123 4567 89"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="swift">SWIFT/BIC</Label>
                <Input
                  id="swift"
                  placeholder="SWIFT/BIC Code"
                  defaultValue="TCZBTR2AXXX"
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings - Glass card */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Ek Ayarlar
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Setting Item 1 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-low/30 transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                ₺1,000 altındaki ödemeleri otomatik onayla
              </p>
              <p className="label-md text-on-surface-variant mt-1">
                Küçük işlemleri otomatik olarak onayla
              </p>
            </div>
            <Checkbox />
          </div>

          {/* Setting Item 2 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-low/30 transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                Ödeme makbuzları gönder
              </p>
              <p className="label-md text-on-surface-variant mt-1">
                Ödemeden sonra müşteriye e-posta makbuzu gönder
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>

          {/* Setting Item 3 */}
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-low/30 transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                Taksitli ödemeleri etkinleştir
              </p>
              <p className="label-md text-on-surface-variant mt-1">
                Müşterilerin taksitli ödeme yapmasına izin ver
              </p>
            </div>
            <Checkbox />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
