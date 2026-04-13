"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Shield, Key, Eye, EyeOff, Smartphone, Lock } from "lucide-react";

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
          <h1 className="headline-lg text-on-surface">
            Güvenlik Ayarları
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Hesap güvenliğinizi ve şifrenizi yönetin
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Change Password */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Şifre Değiştir
            </CardTitle>
          </div>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
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

          <div className="p-4 rounded-xl bg-surface-low/50">
            <p className="label-sm text-on-surface-variant uppercase tracking-wide font-semibold mb-3">Şifre gereksinimleri:</p>
            <ul className="body-sm text-on-surface-variant space-y-1">
              <li>• En az 8 karakter uzunluğunda</li>
              <li>• Büyük ve küçük harf içerir</li>
              <li>• En az bir rakam içerir</li>
              <li>• En az bir özel karakter içerir</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-info" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              İki Faktörlü Kimlik Doğrulama
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50 hover:bg-surface-low transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                2FA'yi Etkinleştir
              </p>
              <p className="body-sm text-on-surface-variant mt-1">
                Hesabınıza ekstra bir güvenlik katmanı ekleyin
              </p>
            </div>
            <Button variant="secondary" size="medium">Etkinleştir</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Aktif Oturumlar
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-success" />
                <div>
                  <p className="body-md font-medium text-on-surface">
                    Mevcut Oturum
                  </p>
                  <p className="body-sm text-on-surface-variant">
                    İstanbul, Türkiye • Windows üzerinde Chrome
                  </p>
                </div>
              </div>
              <span className="body-sm text-success font-semibold">Şimdi aktif</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50 hover:bg-surface-low transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="body-md font-medium text-on-surface">
                    Mobil Uygulama
                  </p>
                  <p className="body-sm text-on-surface-variant">
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
