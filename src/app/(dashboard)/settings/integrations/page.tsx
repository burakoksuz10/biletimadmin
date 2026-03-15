"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Link, ExternalLink } from "lucide-react";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Entegrasyonlar
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Üçüncü taraf hizmetler ve uygulamalarla bağlantı kurun
          </p>
        </div>
      </div>

      {/* Social Media */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Sosyal Medya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Facebook", icon: "📘", connected: true, username: "@biletim" },
            { name: "Twitter/X", icon: "🐦", connected: true, username: "@biletim" },
            { name: "Instagram", icon: "📷", connected: false, username: null },
            { name: "LinkedIn", icon: "💼", connected: false, username: null },
          ].map((social, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{social.icon}</span>
                <div>
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    {social.name}
                  </p>
                  {social.connected && social.username && (
                    <p className="text-[12px] text-[#666d80]">
                      {social.username}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {social.connected ? (
                  <>
                    <Badge variant="success">Bağlı</Badge>
                    <Button variant="secondary" size="small">
                      Bağlantıyı Kes
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" size="small">
                    Bağlan
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Takvim Entegrasyonu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Google Takvim", connected: true, email: "admin@biletim.com" },
            { name: "Apple Takvim", connected: false, email: null },
            { name: "Outlook Takvim", connected: false, email: null },
          ].map((calendar, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f7f7f7] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#666d80]" />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    {calendar.name}
                  </p>
                  {calendar.connected && calendar.email && (
                    <p className="text-[12px] text-[#666d80]">
                      {calendar.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {calendar.connected ? (
                  <>
                    <Badge variant="success">Bağlı</Badge>
                    <Button variant="secondary" size="small">
                      Bağlantıyı Kes
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" size="small">
                    Bağlan
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
              Webhook'lar
            </CardTitle>
            <Button variant="secondary" size="small">
              <Link className="w-4 h-4 mr-2" />
              Webhook Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]">
              <div>
                <p className="text-[14px] font-medium text-[#0d0d12]">
                  Etkinlik Oluşturuldu
                </p>
                <p className="text-[12px] text-[#666d80]">
                  https://api.example.com/webhooks/events
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Aktif</Badge>
                <Button variant="ghost" size="small">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#e5e7eb]">
              <div>
                <p className="text-[14px] font-medium text-[#0d0d12]">
                  Bilet Satın Alındı
                </p>
                <p className="text-[12px] text-[#666d80]">
                  https://api.example.com/webhooks/tickets
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">Durduruldu</Badge>
                <Button variant="ghost" size="small">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-sync Settings */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Otomatik Senkronizasyon Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Etkinlikleri takvime senkronize et
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Yeni etkinlikleri bağlı takvimlere otomatik olarak ekle
              </p>
            </div>
            <Checkbox defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Sosyal medyada paylaş
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Yeni etkinlikleri bağlı hesaplara otomatik olarak gönder
              </p>
            </div>
            <Checkbox />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
