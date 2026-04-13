"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Ban,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Ticket,
  CreditCard,
  TrendingUp,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import { customersService } from "@/lib/api/services";
import type { Customer, CustomerOrder, CustomerActivity, CustomerDetailedStats } from "@/types/customer.types";

type TabType = "overview" | "orders" | "tickets" | "activity" | "notes";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [activity, setActivity] = useState<CustomerActivity[]>([]);
  const [stats, setStats] = useState<CustomerDetailedStats | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setIsLoading(true);
        const customerId = parseInt(params.id as string);
        
        // Paralel olarak müşteri verilerini çek
        const [customerData, ordersData, activityData, statsData] = await Promise.all([
          customersService.getById(customerId),
          customersService.getOrders(customerId),
          customersService.getActivity(customerId),
          customersService.getStats(customerId)
        ]);
        
        setCustomer(customerData);
        setOrders(ordersData.data);
        setActivity(activityData.data);
        setStats(statsData);
      } catch (error) {
        console.error("Müşteri yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomer();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#09724a] mx-auto mb-4" />
          <p className="text-on-surface-variant">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-[#df1c41] mx-auto mb-4" />
          <p className="text-[#0d0d12]">Müşteri bulunamadı</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  const statusVariantMap: Record<string, "success" | "warning" | "danger"> = {
    active: "success",
    suspended: "warning",
    banned: "danger",
  };

  const statusLabels: Record<string, string> = {
    active: "Aktif",
    suspended: "Askıya Alındı",
    banned: "Yasaklandı",
  };

  const segmentVariantMap: Record<string, "success" | "info" | "neutral" | "warning" | "danger"> = {
    vip: "success",
    regular: "info",
    new: "neutral",
    at_risk: "warning",
    lost: "danger",
    one_time: "neutral",
  };

  const segmentLabels: Record<string, string> = {
    vip: "VIP",
    regular: "Normal",
    new: "Yeni",
    at_risk: "Riskli",
    lost: "Kayıp",
    one_time: "Tek Seferlik",
  };

  const orderStatusVariantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    completed: "success",
    pending: "warning",
    cancelled: "danger",
    refunded: "danger",
  };

  const orderStatusLabels: Record<string, string> = {
    completed: "Tamamlandı",
    pending: "Beklemede",
    cancelled: "İptal",
    refunded: "İade",
  };

  const ticketStatusVariantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
    valid: "success",
    used: "neutral",
    cancelled: "danger",
    expired: "danger",
  };

  const ticketStatusLabels: Record<string, string> = {
    valid: "Geçerli",
    used: "Kullanıldı",
    cancelled: "İptal",
    expired: "Süresi Doldu",
  };

  const activityTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    login: Clock,
    order: CreditCard,
    ticket_use: Ticket,
    cancellation: XCircle,
    review: Star,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="small" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="w-16 h-16 rounded-full bg-[#e1eee3] border-2 border-[#09724a] flex items-center justify-center">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Users className="w-8 h-8 text-[#09724a]" />
            )}
          </div>
          <div>
            <h1 className="headline-lg font-semibold text-on-surface">
              {customer.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="body-md text-on-surface-variant">{customer.email}</p>
              <span className="text-on-surface-variant">•</span>
              <p className="body-md text-on-surface-variant">{customer.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {customer.status === "active" ? (
            <Button
              variant="secondary"
              className="text-[#d39c3d] hover:bg-[#fff8f0]"
              onClick={() => {
                // TODO: Suspend customer
              }}
            >
              <Ban className="w-4 h-4 mr-2" />
              Askıya Al
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="text-[#09724a] hover:bg-[#e1eee3]"
              onClick={() => {
                // TODO: Activate customer
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Etkinleştir
            </Button>
          )}
          <Link href={`/customers/${customer.id}/edit`}>
            <Button className="bg-[#09724a] hover:bg-[#0d8a52] text-white">
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-3">
        <Badge variant={statusVariantMap[customer.status]}>
          {statusLabels[customer.status]}
        </Badge>
        {customer.customer_segment && (
          <Badge variant={segmentVariantMap[customer.customer_segment]}>
            {segmentLabels[customer.customer_segment]} Müşteri
          </Badge>
        )}
        <p className="body-md text-on-surface-variant">
          Kayıt: {formatDate(customer.created_at)}
        </p>
        {customer.last_login && (
          <p className="body-md text-on-surface-variant">
            Son giriş: {formatDate(customer.last_login)}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb]">
        <div className="flex gap-6">
          {[
            { id: "overview", label: "Genel", icon: Users },
            { id: "orders", label: "Siparişler", icon: CreditCard },
            { id: "tickets", label: "Biletler", icon: Ticket },
            { id: "activity", label: "Aktivite", icon: Clock },
            { id: "notes", label: "Notlar", icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#09724a] text-[#09724a]"
                    : "border-transparent text-on-surface-variant hover:text-[#0d0d12]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="label-md text-on-surface-variant">Ad Soyad</p>
                  <p className="body-md font-medium text-on-surface">
                    {customer.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="label-md text-on-surface-variant">E-posta</p>
                  <p className="text-[14px] text-[#0d0d12]">{customer.email}</p>
                  {customer.email_verified && (
                    <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <p className="label-md text-on-surface-variant">Telefon</p>
                  <p className="text-[14px] text-[#0d0d12]">{customer.phone}</p>
                  {customer.phone_verified && (
                    <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  )}
                </div>
              </div>
              {customer.birth_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="label-md text-on-surface-variant">Doğum Tarihi</p>
                    <p className="text-[14px] text-[#0d0d12]">
                      {formatDate(customer.birth_date)}
                    </p>
                  </div>
                </div>
              )}
              {customer.gender && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="label-md text-on-surface-variant">Cinsiyet</p>
                    <p className="text-[14px] text-[#0d0d12]">
                      {customer.gender === "male"
                        ? "Erkek"
                        : customer.gender === "female"
                        ? "Kadın"
                        : customer.gender === "other"
                        ? "Diğer"
                        : "Belirtmek İstemiyor"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Konum Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="label-md text-on-surface-variant">Şehir</p>
                    <p className="text-[14px] text-[#0d0d12]">{customer.city}</p>
                  </div>
                </div>
              )}
              {customer.country && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="label-md text-on-surface-variant">Ülke</p>
                    <p className="text-[14px] text-[#0d0d12]">{customer.country}</p>
                  </div>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-on-surface-variant" />
                  <div>
                    <p className="label-md text-on-surface-variant">Adres</p>
                    <p className="text-[14px] text-[#0d0d12]">{customer.address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="title-lg">Hesap Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="body-md text-on-surface-variant">Durum</span>
                <Badge variant={statusVariantMap[customer.status]}>
                  {statusLabels[customer.status]}
                </Badge>
              </div>
              {customer.customer_segment && (
                <div className="flex items-center justify-between">
                  <span className="body-md text-on-surface-variant">Segment</span>
                  <Badge variant={segmentVariantMap[customer.customer_segment]}>
                    {segmentLabels[customer.customer_segment]}
                  </Badge>
                </div>
              )}
              {customer.loyalty_points && (
                <div className="flex items-center justify-between">
                  <span className="body-md text-on-surface-variant">Loyalty Puanı</span>
                  <span className="text-[14px] font-medium text-on-surface">
                    {customer.loyalty_points.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="body-md text-on-surface-variant">Newsletter</span>
                <span className="text-[14px] text-on-surface">
                  {customer.newsletter_subscribed ? "Abone" : "Abone değil"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="body-md text-on-surface-variant">SMS Bildirimler</span>
                <span className="text-[14px] text-on-surface">
                  {customer.sms_notifications ? "Açık" : "Kapalı"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="border-[#e5e7eb] lg:col-span-2">
            <CardHeader>
              <CardTitle className="title-lg">İstatistik Özeti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="label-md text-on-surface-variant">Toplam Sipariş</p>
                  <p className="text-[24px] font-semibold text-on-surface">
                    {stats?.total_orders ?? 0}
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Toplam Bilet</p>
                  <p className="text-[24px] font-semibold text-on-surface">
                    {stats?.total_tickets ?? 0}
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Toplam Harcama</p>
                  <p className="text-[24px] font-semibold text-[#09724a]">
                    {formatCurrency(stats?.total_spent ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="label-md text-on-surface-variant">Ortalama Sipariş</p>
                  <p className="text-[24px] font-semibold text-on-surface">
                    {formatCurrency(stats?.average_order_value ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Categories */}
          {stats?.favorite_categories && stats.favorite_categories.length > 0 && (
            <Card className="border-[#e5e7eb]">
              <CardHeader>
                <CardTitle className="title-lg">Favori Kategoriler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.favorite_categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-[14px] text-on-surface">{cat.name}</span>
                      <Badge variant="neutral">{cat.count} etkinlik</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Favorite Venues */}
          {stats?.favorite_venues && stats.favorite_venues.length > 0 && (
            <Card className="border-[#e5e7eb]">
              <CardHeader>
                <CardTitle className="title-lg">Favori Mekanlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.favorite_venues.map((venue, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-[14px] text-on-surface">{venue.name}</span>
                      <Badge variant="neutral">{venue.count} ziyaret</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly Spending Chart */}
          <Card className="border-[#e5e7eb] lg:col-span-2">
            <CardHeader>
              <CardTitle className="title-lg">Aylık Harcama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2">
                {stats?.monthly_spending && stats.monthly_spending.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-[#e1eee3] rounded-t-lg transition-all hover:bg-[#09724a]"
                      style={{
                        height: `${(item.amount / Math.max(...stats.monthly_spending.map((s) => s.amount))) * 100}%`,
                        minHeight: "20px",
                      }}
                    />
                    <p className="label-sm text-on-surface-variant">
                      {new Date(item.month).toLocaleDateString("tr-TR", {
                        month: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "orders" && (
        <Card className="border-[#e5e7eb]">
          <CardHeader>
            <CardTitle className="title-lg">Sipariş Geçmi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#e5e7eb] rounded-lg p-4 hover:bg-[#f7f7f7] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[14px] font-medium text-on-surface">
                        {order.event_title}
                      </p>
                      <p className="label-md text-on-surface-variant mt-1">
                        {order.venue_name}
                      </p>
                      <p className="label-md text-on-surface-variant">
                        {formatDate(order.event_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="title-lg font-semibold text-[#09724a]">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <p className="label-md text-on-surface-variant">
                        {order.ticket_count} bilet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={orderStatusVariantMap[order.status]}>
                        {orderStatusLabels[order.status]}
                      </Badge>
                      <span className="label-md text-on-surface-variant">
                        {order.order_number}
                      </span>
                    </div>
                    <p className="label-md text-on-surface-variant">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "tickets" && (
        <Card className="border-[#e5e7eb]">
          <CardHeader>
            <CardTitle className="title-lg">Biletler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.flatMap((order) => order.tickets || []).map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between border border-[#e5e7eb] rounded-lg p-3 hover:bg-[#f7f7f7] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-[#09724a]" />
                    <div>
                      <p className="text-[14px] font-medium text-on-surface">
                        {ticket.ticket_type}
                      </p>
                      <p className="label-md text-on-surface-variant">
                        {ticket.ticket_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={ticketStatusVariantMap[ticket.status]}>
                      {ticketStatusLabels[ticket.status]}
                    </Badge>
                    <p className="text-[14px] font-medium text-on-surface">
                      {formatCurrency(ticket.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "activity" && (
        <Card className="border-[#e5e7eb]">
          <CardHeader>
            <CardTitle className="title-lg">Aktivite Geçmişi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.map((item) => {
                const Icon = activityTypeIcons[item.type] || Clock;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-4 border-b border-[#e5e7eb] last:border-0 last:pb-0"
                >
                    <div className="w-8 h-8 rounded-full bg-[#f7f7f7] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-on-surface">
                        {item.description}
                      </p>
                      <p className="label-md text-on-surface-variant mt-1">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notes" && (
        <Card className="border-[#e5e7eb]">
          <CardHeader>
            <CardTitle className="title-lg">Notlar ve Etiketler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
              <p className="body-md text-on-surface-variant">
                Henüz not eklenmemiş
              </p>
              <Button className="mt-4">
                <Star className="w-4 h-4 mr-2" />
                İlk Not Ekle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
