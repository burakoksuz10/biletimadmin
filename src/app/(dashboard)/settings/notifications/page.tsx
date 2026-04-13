"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Bell, Mail, Smartphone, MessageSquare } from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export default function NotificationSettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "new-event",
      title: "Yeni Etkinlik Oluşturuldu",
      description: "Yeni bir etkinlik oluşturulduğunda bildirim al",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "ticket-sale",
      title: "Bilet Satışı",
      description: "Bir bilet satıldığında bildirim al",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "payout-request",
      title: "Ödeme Talebi",
      description: "Bir ödeme talep edildiğinde bildirim al",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "user-registration",
      title: "Kullanıcı Kaydı",
      description: "Yeni bir kullanıcı kayıt olduğunda bildirim al",
      email: false,
      push: true,
      sms: false,
    },
    {
      id: "event-cancelled",
      title: "Etkinlik İptal Edildi",
      description: "Bir etkinlik iptal edildiğinde bildirim al",
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "system-updates",
      title: "Sistem Güncellemeleri",
      description: "Sistem güncellemeleri ve bakım hakkında bildirim al",
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "refund-request",
      title: "İade Talebi",
      description: "Bir iade talep edildiğinde bildirim al",
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "weekly-report",
      title: "Haftalık Rapor",
      description: "Haftalık özet rapor al",
      email: true,
      push: false,
      sms: false,
    },
  ]);

  const toggleNotification = (
    id: string,
    channel: "email" | "push" | "sms"
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg text-on-surface">
            Bildirim Ayarları
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Bildirimleri nasıl alacağınızı yönetin
          </p>
        </div>
        <Button variant="primary">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>

      <Card variant="default" padding="none">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline/30 bg-surface-low/50">
                <th className="text-left py-4 px-6 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                  Bildirim
                </th>
                <th className="text-center py-4 px-4 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-on-surface-variant" />
                    E-posta
                  </div>
                </th>
                <th className="text-center py-4 px-4 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                  <div className="flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4 text-on-surface-variant" />
                    Anlık
                  </div>
                </th>
                <th className="text-center py-4 px-4 label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4 text-on-surface-variant" />
                    SMS
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className="border-b border-outline/30 last:border-0 hover:bg-surface-low/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="body-md font-medium text-on-surface">
                      {notification.title}
                    </p>
                    <p className="body-sm text-on-surface-variant mt-0.5">
                      {notification.description}
                    </p>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={notification.email}
                        onCheckedChange={() =>
                          toggleNotification(notification.id, "email")
                        }
                      />
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={notification.push}
                        onCheckedChange={() =>
                          toggleNotification(notification.id, "push")
                        }
                      />
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={notification.sms}
                        onCheckedChange={() =>
                          toggleNotification(notification.id, "sms")
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
