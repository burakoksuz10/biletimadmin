"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Upload, Camera, User, BarChart3, AlertTriangle } from "lucide-react";

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Admin Kullanıcı",
    email: "admin@biletim.com",
    phone: "+90 555 123 4567",
    bio: "Event organizer and manager",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Hesap Ayarları
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Hesap bilgilerinizi ve tercihlerinizi yönetin
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Profile Picture */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Profil Fotoğrafı
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                <span className="display-sm font-bold text-primary">
                  {formData.name ? formData.name.charAt(0) : "A"}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-glow hover:opacity-90 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <Button variant="secondary" size="small">
                <Upload className="w-4 h-4 mr-2" />
                Yeni Yükle
              </Button>
              <p className="label-md text-on-surface-variant mt-2">
                Önerilen: 200x200px, JPG veya PNG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center">
              <User className="w-4 h-4 text-info" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Kişisel Bilgiler
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Adınızı soyadınızı girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="E-posta adresinizi girin"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon Numarası</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+90 555 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Input
                id="role"
                value="Süper Admin"
                disabled
                className="bg-surface-low"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-outline/50 bg-surface-high text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
              placeholder="Kendinizden bahsedin..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-success" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Hesap İstatistikleri
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-surface-low/50">
              <p className="label-sm text-on-surface-variant uppercase tracking-wide font-semibold">Üyelik Tarihi</p>
              <p className="headline-sm font-semibold text-on-surface mt-2">
                January 2024
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-low/50">
              <p className="label-sm text-on-surface-variant uppercase tracking-wide font-semibold">Oluşturulan Etkinlikler</p>
              <p className="headline-sm font-semibold text-on-surface mt-2">
                24
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-low/50">
              <p className="label-sm text-on-surface-variant uppercase tracking-wide font-semibold">Toplam Gelir</p>
              <p className="headline-sm font-semibold text-on-surface mt-2">
                ₺125,000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-danger/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-danger" />
            </div>
            <CardTitle className="title-lg font-semibold text-danger">
              Tehlike Bölgesi
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-danger/5 hover:bg-danger/10 transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                Hesabı Sil
              </p>
              <p className="body-sm text-on-surface-variant mt-1">
                Hesabınızı ve tüm verilerinizi kalıcı olarak silin
              </p>
            </div>
            <Button variant="danger">Hesabı Sil</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
