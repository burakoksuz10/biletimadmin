"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { HelpCircle, Mail, MessageCircle, Book, Video, HeadphonesIcon } from "lucide-react";

export default function HelpSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="headline-lg font-semibold text-on-surface">
            Yardım & Destek
          </h1>
          <p className="body-md text-on-surface-variant mt-1">
            Biletim ile ilgili yardım alın
          </p>
        </div>
      </div>

      {/* Quick Help */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            Hızlı Yardım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#09724a] transition-colors cursor-pointer">
              <Book className="w-8 h-8 text-[#09724a] mb-3" />
              <h3 className="body-md font-semibold text-on-surface mb-1">
                Dokümantasyon
              </h3>
              <p className="label-md text-on-surface-variant">
                Kapsamlı kılavuzlarımızı ve öğreticilerimizi inceleyin
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#09724a] transition-colors cursor-pointer">
              <Video className="w-8 h-8 text-[#0177fb] mb-3" />
              <h3 className="body-md font-semibold text-on-surface mb-1">
                Video Öğreticiler
              </h3>
              <p className="label-md text-on-surface-variant">
                Adım adım video rehberleri izleyin
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#09724a] transition-colors cursor-pointer">
              <MessageCircle className="w-8 h-8 text-[#d39c3d] mb-3" />
              <h3 className="body-md font-semibold text-on-surface mb-1">
                Topluluk Forumu
              </h3>
              <p className="label-md text-on-surface-variant">
                Diğer Biletim kullanıcılarıyla bağlantı kurun
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#09724a] transition-colors cursor-pointer">
              <HeadphonesIcon className="w-8 h-8 text-[#8b5cf6] mb-3" />
              <h3 className="body-md font-semibold text-on-surface mb-1">
                Canlı Sohbet
              </h3>
              <p className="label-md text-on-surface-variant">
                Destek ekibimizle sohbet edin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            Destek İle İletişime Geçin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Konu</Label>
              <Input
                id="subject"
                placeholder="Ne konuda yardıma ihtiyacınız var?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className="w-full h-[52px] px-4 rounded-[10px] border border-[#e5e7eb] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#09724a]"
              >
                <option value="">Bir kategori seçin</option>
                <option value="billing">Faturalandırma</option>
                <option value="technical">Teknik</option>
                <option value="account">Hesap</option>
                <option value="feature">Özellik Talebi</option>
                <option value="other">Diğer</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-4 py-3 rounded-[10px] border border-[#e5e7eb] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#09724a] resize-none"
              placeholder="Sorununuzu detaylı şekilde açıklayın..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Button>Mesaj Gönder</Button>
            <Button variant="secondary">
              <Mail className="w-4 h-4 mr-2" />
              support@biletim.com
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="title-lg font-semibold text-on-surface">
            Sıkça Sorulan Sorular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                q: "Yeni bir etkinlik nasıl oluştururum?",
                a: "Etkinlikler sayfasına gidin ve 'Etkinlik Oluştur' butonuna tıklayın. Gerekli bilgileri doldurun ve yayınlayın.",
              },
              {
                q: "Ödemeleri nasıl işlerim?",
                a: "Ödemeler sayfasına gidin, bekleyen talepleri inceleyin ve onaylayın veya reddedin.",
              },
              {
                q: "Etkinlik sayfamı özelleştirebilir miyim?",
                a: "Evet, etkinlik sayfalarınıza özel resimler, açıklamalar ve marka ekleyebilirsiniz.",
              },
              {
                q: "Raporları nasıl dışa aktarırım?",
                a: "Raporlar sayfasına gidin, tarih aralığını seçin ve Dışa Aktar butonuna tıklayın.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-4 rounded-xl border border-[#e5e7eb] cursor-pointer"
              >
                <summary className="flex items-center justify-between body-md font-medium text-on-surface">
                  {faq.q}
                  <HelpCircle className="w-5 h-5 text-on-surface-variant group-open:text-[#09724a]" />
                </summary>
                <p className="label-md text-on-surface-variant mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
