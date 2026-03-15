"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, CreditCard, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Ödeme Ayarları
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Ödeme yöntemlerini ve yapılandırmaları yönetin
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Payment Methods */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Ödeme Yöntemleri
            </CardTitle>
            <Button variant="secondary" size="small">
              <Plus className="w-4 h-4 mr-2" />
              Yöntem Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#e1eee3] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    Stripe
                  </p>
                  <Badge variant="success">Aktif</Badge>
                </div>
                <p className="text-[12px] text-[#666d80]">
                  Hesaba bağlı: test@stripe.com
                </p>
              </div>
            </div>
            <Button variant="secondary" size="small">
              Yapılandır
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#f7f7f7] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#818898]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    PayPal
                  </p>
                  <Badge variant="neutral">İnaktif</Badge>
                </div>
                <p className="text-[12px] text-[#666d80]">
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

      {/* Bank Transfer */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Banka Transferi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Banka Transferini Etkinleştir
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Müşterilerin banka transferi ile ödeme yapmasına izin ver
              </p>
            </div>
            <Checkbox />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                defaultValue="TR01 0001 2345 6789 0123 4567 89"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="swift">SWIFT/BIC</Label>
              <Input
                id="swift"
                placeholder="SWIFT/BIC Code"
                defaultValue="TCZBTR2AXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Ek Ayarlar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                ₺1,000 altındaki ödemeleri otomatik onayla
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Küçük işlemleri otomatik olarak onayla
              </p>
            </div>
            <Checkbox />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Ödeme makbuzları gönder
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Ödemeden sonra müşteriye e-posta makbuzu gönder
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Taksitli ödemeleri etkinleştir
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
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
