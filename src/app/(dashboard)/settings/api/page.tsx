"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Key, Plus, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";

export default function ApiSettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("api_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg font-semibold text-on-surface">
            API Ayarları
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            API anahtarlarını ve erişimi yönetin
          </p>
        </div>
      </div>

      {/* API Keys */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="title-lg font-semibold text-on-surface">
              API Anahtarları
            </CardTitle>
            <Button variant="secondary" size="small">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Anahtar Oluştur
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl border border-[#e5e7eb]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="body-md font-medium text-on-surface">
                    Canlı Anahtar
                  </p>
                  <Badge variant="success">Aktif</Badge>
                </div>
                <p className="label-md text-on-surface-variant mt-1">
                  Oluşturuldu: 15 Oca 2026 • Son kullanım: 2 saat önce
                </p>
              </div>
              <Button variant="secondary" size="small">
                <RefreshCw className="w-4 h-4 mr-2" />
                Yeniden Oluştur
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={showKey ? apiKey : "sk_live_" + "•".repeat(40)}
                  readOnly
                  className="bg-[#f7f7f7] pr-20"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >
                  {showKey ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Button variant="secondary" size="small">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e5e7eb]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="body-md font-medium text-on-surface">
                    Test Anahtarı
                  </p>
                  <Badge variant="neutral">Test</Badge>
                </div>
                <p className="label-md text-on-surface-variant mt-1">
                  Oluşturuldu: 15 Oca 2026 • Son kullanım: 1 gün önce
                </p>
              </div>
              <Button variant="secondary" size="small">
                <RefreshCw className="w-4 h-4 mr-2" />
                Yeniden Oluştur
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={`sk_test_${"•".repeat(40)}`}
                readOnly
                className="flex-1 bg-[#f7f7f7]"
              />
              <Button variant="secondary" size="small">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            API Dokümantasyonu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-[#f7f7f7]">
            <p className="text-[14px] text-[#666d80] mb-4">
              Biletim'i uygulamalarınızla entegre etmek için kapsamlı API dokümantasyonumuza erişin.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="secondary">
                <Key className="w-4 h-4 mr-2" />
                Dokümantasyonu Görüntüle
              </Button>
              <Button variant="secondary">
                Postman Koleksiyonunu İndir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            Hız Limitleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="label-md text-on-surface-variant">Dakikadaki istek</p>
              <p className="headline-lg font-semibold text-on-surface mt-1">
                1,000
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="label-md text-on-surface-variant">Günlük istek</p>
              <p className="headline-lg font-semibold text-on-surface mt-1">
                100,000
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="label-md text-on-surface-variant">Bugünkü kullanım</p>
              <p className="text-[24px] font-semibold text-[#09724a] mt-1">
                12,458
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Endpoints */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            Webhook Uç Noktaları
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f7f7f7]">
              <code className="label-md text-on-surface">
                POST /api/v1/events
              </code>
              <span className="label-md text-on-surface-variant">Etkinlik oluştur</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f7f7f7]">
              <code className="label-md text-on-surface">
                GET /api/v1/events/:id
              </code>
              <span className="label-md text-on-surface-variant">Etkinlik detaylarını al</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f7f7f7]">
              <code className="label-md text-on-surface">
                POST /api/v1/tickets
              </code>
              <span className="label-md text-on-surface-variant">Bilet oluştur</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
