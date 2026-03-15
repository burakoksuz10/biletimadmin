"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, CreditCard, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-[#0d0d12]">
            Faturalandırma & Abonelik
          </h1>
          <p className="text-[14px] text-[#666d80] mt-1">
            Aboneliğinizi ve fatura geçmişinizi yönetin
          </p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Faturaları İndir
        </Button>
      </div>

      {/* Current Plan */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Mevcut Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[24px] font-semibold text-[#0d0d12]">
                  Pro Plan
                </h2>
                <Badge variant="success">Aktif</Badge>
              </div>
              <p className="text-[14px] text-[#666d80] mt-2">
                ₺499/ay • 15 Mart 2026 tarihinde yenilenir
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[14px] text-[#0d0d12]">
                  <Check className="w-4 h-4 text-[#09724a]" />
                  Sınırsız etkinlik
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#0d0d12]">
                  <Check className="w-4 h-4 text-[#09724a]" />
                  Gelişmiş analitik
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#0d0d12]">
                  <Check className="w-4 h-4 text-[#09724a]" />
                  Öncelikli destek
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#0d0d12]">
                  <Check className="w-4 h-4 text-[#09724a]" />
                  Özel markalama
                </div>
              </div>
            </div>
            <Button>Planı Yükselt</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Ödeme Yöntemi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f7f7]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#09724a]" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#0d0d12]">
                  •••• •••• •••• 4242
                </p>
                <p className="text-[12px] text-[#666d80]">
                  Son kullanma: 12/2028
                </p>
              </div>
            </div>
            <Button variant="secondary" size="small">
              Güncelle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-[#e5e7eb]">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold text-[#0d0d12]">
            Fatura Geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="text-right py-3 px-4 text-[12px] font-medium text-[#818898] uppercase tracking-wider">
                    Fatura
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "15 Şub 2026", desc: "Pro Plan", amount: 499, status: "paid" },
                  { date: "15 Oca 2026", desc: "Pro Plan", amount: 499, status: "paid" },
                  { date: "15 Ara 2025", desc: "Pro Plan", amount: 499, status: "paid" },
                  { date: "15 Kas 2025", desc: "Basic Plan", amount: 199, status: "paid" },
                ].map((invoice, i) => (
                  <tr key={i} className="border-b border-[#e5e7eb] hover:bg-[#f7f7f7]">
                    <td className="py-3 px-4 text-[14px] text-[#0d0d12]">
                      {invoice.date}
                    </td>
                    <td className="py-3 px-4 text-[14px] text-[#666d80]">
                      {invoice.desc}
                    </td>
                    <td className="py-3 px-4 text-[14px] font-semibold text-[#0d0d12]">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">Ödendi</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="small">
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
