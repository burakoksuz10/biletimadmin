"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Shield, Key, Eye, EyeOff } from "lucide-react";

export default function SecuritySettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Güvenlik Ayarları
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Hesap güvenliğinizi ve şifrenizi yönetin
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Change Password */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Şifre Değiştir
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mevcut Şifre</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                placeholder="Mevcut şifrenizi girin"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#818898]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre</Label>
            <Input
              id="new-password"
              type="password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              placeholder="Yeni şifrenizi girin"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Yeni Şifreyi Onayla</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              placeholder="Yeni şifrenizi onaylayın"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#f7f7f7]">
            <p className="text-[12px] text-[#666d80] mb-2">Şifre gereksinimleri:</p>
            <ul className="text-[12px] text-[#818898] space-y-1">
              <li>• En az 8 karakter uzunluğunda</li>
              <li>• Büyük ve küçük harf içerir</li>
              <li>• En az bir rakam içerir</li>
              <li>• En az bir özel karakter içerir</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            İki Faktörlü Kimlik Doğrulama
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                2FA'yi Etkinleştir
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
                Hesabınıza ekstra bir güvenlik katmanı ekleyin
              </p>
            </div>
            <Button variant="secondary">Etkinleştir</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Aktif Oturumlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f7f7]">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#09724a]" />
                <div>
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    Mevcut Oturum
                  </p>
                  <p className="text-[12px] text-[#666d80]">
                    İstanbul, Türkiye • Windows üzerinde Chrome
                  </p>
                </div>
              </div>
              <span className="text-[12px] text-[#09724a]">Şimdi aktif</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f7f7]">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[#818898]" />
                <div>
                  <p className="text-[14px] font-medium text-[#0d0d12]">
                    Mobil Uygulama
                  </p>
                  <p className="text-[12px] text-[#666d80]">
                    İstanbul, Türkiye • iOS Uygulaması
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="small">
                İptal Et
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
