"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Upload, Camera } from "lucide-react";

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
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Hesap Ayarları
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Hesap bilgilerinizi ve tercihlerinizi yönetin
          </p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Profile Picture */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Profil Fotoğrafı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#e1eee3] border-4 border-[#09724a] flex items-center justify-center">
                <span className="text-[28px] font-bold text-[#09724a]">
                  {formData.name ? formData.name.charAt(0) : "A"}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#09724a] flex items-center justify-center text-white hover:bg-[#066d41] transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <Button variant="secondary" size="small">
                <Upload className="w-4 h-4 mr-2" />
                Yeni Yükle
              </Button>
              <p className="text-[12px] text-[#818898] mt-2">
                Önerilen: 200x200px, JPG veya PNG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Kişisel Bilgiler
          </CardTitle>
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
                className="bg-[#f7f7f7]"
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
              className="w-full px-4 py-3 rounded-[10px] border border-[#e5e7eb] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#09724a] resize-none"
              placeholder="Kendinizden bahsedin..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Hesap İstatistikleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="text-[12px] text-[#666d80]">Üyelik Tarihi</p>
              <p className="text-[18px] font-semibold text-[#0d0d12] mt-1">
                January 2024
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="text-[12px] text-[#666d80]">Oluşturulan Etkinlikler</p>
              <p className="text-[18px] font-semibold text-[#0d0d12] mt-1">
                24
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#f7f7f7]">
              <p className="text-[12px] text-[#666d80]">Toplam Gelir</p>
              <p className="text-[18px] font-semibold text-[#0d0d12] mt-1">
                ₺125,000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[#df1c41]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#df1c41]">
            Tehlike Bölgesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#0d0d12]">
                Hesabı Sil
              </p>
              <p className="text-[12px] text-[#666d80] mt-1">
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
