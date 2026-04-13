"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, Upload, Globe, Settings as SettingsIcon } from "lucide-react";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Biletim",
    siteUrl: "https://biletim.com",
    defaultLanguage: "tr",
    defaultCurrency: "TRY",
    timezone: "Europe/Istanbul",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Genel Ayarlar
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Platform ayarlarınızı ve tercihlerinizi yönetin
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      {/* Site Settings */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Site Bilgileri
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Adı</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                placeholder="Site adını girin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL'si</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) =>
                  setSettings({ ...settings, siteUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Varsayılan Dil</Label>
              <select
                id="defaultLanguage"
                value={settings.defaultLanguage}
                onChange={(e) =>
                  setSettings({ ...settings, defaultLanguage: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-outline/50 bg-surface-high text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Varsayılan Para Birimi</Label>
              <select
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCurrency: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl border border-outline/50 bg-surface-high text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                <option value="TRY">Türk Lirası (TRY)</option>
                <option value="USD">Amerikan Doları (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">İngiliz Sterlini (GBP)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Saat Dilimi</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
              className="w-full h-11 px-4 rounded-xl border border-outline/50 bg-surface-high text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            >
              <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="America/Los_Angeles">
                America/Los_Angeles (UTC-8)
              </option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logo & Favicon */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-secondary" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Marka
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-surface-low border border-outline/30 flex items-center justify-center">
                  <span className="headline-lg font-bold text-primary">
                    ET
                  </span>
                </div>
                <div className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Logo Yükle
                  </Button>
                  <p className="label-md text-on-surface-variant mt-2">
                    Önerilen: 200x60px, PNG veya SVG
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-low border border-outline/30 flex items-center justify-center">
                  <span className="title-lg font-bold text-primary">
                    ET
                  </span>
                </div>
                <div className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Favicon Yükle
                  </Button>
                  <p className="label-md text-on-surface-variant mt-2">
                    Önerilen: 32x32px, PNG veya ICO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-warning" />
            </div>
            <CardTitle className="title-lg font-semibold text-on-surface">
              Bakım Modu
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-low/50 hover:bg-surface-low transition-colors">
            <div>
              <p className="body-md font-medium text-on-surface">
                Bakım Modunu Etkinleştir
              </p>
              <p className="body-sm text-on-surface-variant mt-1">
                Etkinleştirildiğinde, siteye sadece yöneticiler erişebilir
              </p>
            </div>
            <Checkbox />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
