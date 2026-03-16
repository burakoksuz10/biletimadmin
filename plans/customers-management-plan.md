# Müşteriler (Customers) Yönetim Modülü - Kapsamlı Plan

## Mevcut Durum Analizi

### Şu Anki Yapı
- **Kullanıcılar (/users)**: Admin paneli kullanıcıları (super_admin, org_admin, co_admin)
- **Eksiklik**: Bilet alan gerçek müşteriler için ayrı bir yapı yok

### İhtiyaç
Bilet satın alan müşterileri yönetmek, istatistiklerini görmek ve analiz etmek için ayrı bir **Müşteriler** modülü

---

## Veri Modeli

### Customer (Müşteri) Entity

```typescript
interface Customer {
  // Temel Bilgiler
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  
  // Demografik Bilgiler
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  birth_date?: string; // YYYY-MM-DD
  city?: string;
  country?: string;
  postal_code?: string;
  address?: string;
  
  // Durum Bilgileri
  status: "active" | "suspended" | "banned";
  email_verified: boolean;
  phone_verified: boolean;
  
  // İstatistikler (Backend'den gelecek)
  total_orders: number;          // Toplam sipariş sayısı
  total_spent: number;           // Toplam harcama (TL)
  total_tickets: number;         // Toplam bilet sayısı
  events_attended: number;       // Katıldığı etkinlik sayısı
  upcoming_events: number;       // Yaklaşan etkinlik sayısı
  favorite_categories: string[]; // En çok bilet aldığı kategoriler
  
  // İlişkiler
  orders?: Order[];              // Müşterinin siparişleri
  tickets?: Ticket[];            // Müşterinin biletleri
  reviews?: Review[];            // Müşterinin yorumları
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_order_date?: string;
  last_login?: string;
  
  // Marketing
  newsletter_subscribed: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  
  // Segmentasyon
  customer_segment?: "vip" | "regular" | "new" | "inactive";
  loyalty_points?: number;
}
```

### Customer Order Summary (Sipariş Özeti)

```typescript
interface CustomerOrder {
  id: number;
  order_number: string;
  event_id: number;
  event_title: string;
  event_date: string;
  venue_name: string;
  ticket_count: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  tickets: CustomerTicket[];
}

interface CustomerTicket {
  id: number;
  ticket_number: string;
  ticket_type: string;
  price: number;
  status: "valid" | "used" | "cancelled" | "expired";
  qr_code?: string;
}
```

### Customer Statistics (Müşteri İstatistikleri)

```typescript
interface CustomerStats {
  // Genel İstatistikler
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  suspended_customers: number;
  banned_customers: number;
  
  // Finansal İstatistikler
  total_revenue: number;
  average_order_value: number;
  top_spending_customers: TopCustomer[];
  
  // Davranışsal İstatistikler
  average_tickets_per_customer: number;
  average_events_per_customer: number;
  repeat_customer_rate: number;
  churn_rate: number;
  
  // Segmentasyon
  vip_customers: number;
  regular_customers: number;
  new_customers: number;
  inactive_customers: number;
}

interface TopCustomer {
  id: number;
  name: string;
  email: string;
  total_spent: number;
  total_orders: number;
  total_tickets: number;
}
```

---

## Özellikler ve Fonksiyonellik

### 1. Müşteri Listesi
- ✅ Tüm müşterileri tablo halinde görüntüleme
- ✅ Arama (isim, email, telefon)
- ✅ Filtreleme
  - Durum (aktif, askıda, yasaklı)
  - Segment (VIP, normal, yeni, inaktif)
  - Kayıt tarihi aralığı
  - Harcama miktarı aralığı
  - Şehir, ülke
- ✅ Sıralama (isim, kayıt tarihi, toplam harcama, son sipariş)
- ✅ Pagination
- ✅ Bulk actions (toplu işlemler)
  - Toplu e-posta gönderme
  - Toplu askıya alma/aktifleştirme
  - Excel export

### 2. Müşteri Detay Sayfası (/customers/[id])

#### Genel Bilgiler Tab
- Kişisel bilgiler (isim, email, telefon, doğum tarihi)
- İletişim bilgileri (adres, şehir, ülke)
- Hesap durumu (aktif, email onaylı, telefon onaylı)
- Kayıt tarihi, son giriş tarihi

#### Sipariş Geçmişi Tab
- Tüm siparişlerin listesi
- Sipariş detayları (etkinlik, tarih, tutar, durum)
- Bilet detayları (bilet numarası, QR kod, durum)
- Ödeme bilgileri
- İptal/iade talepleri

#### İstatistikler Tab
- Toplam harcama (grafik ile aylık breakdown)
- Satın alınan bilet sayısı (zaman içinde trend)
- Katıldığı etkinlik sayısı
- En çok tercih ettiği kategoriler (pasta grafik)
- En çok gittiği mekanlar
- Ortalama sipariş değeri
- İlk sipariş tarihi, son sipariş tarihi
- Müşteri lifetime value (CLV)

#### Aktivite Geçmişi Tab
- Giriş yapma aktiviteleri
- Sipariş aktiviteleri
- Bilet kullanım aktiviteleri
- İptal/iade aktiviteleri
- Yorum/değerlendirme aktiviteleri

#### Notlar ve Etiketler Tab
- Admin notları ekleme/görüntüleme
- Müşteri etiketleri (VIP, problematic, high-value vb.)
- Özel durumlar (alerjiler, erişilebilirlik ihtiyaçları vb.)

### 3. Müşteri Filtreleme ve Segmentasyon

#### Standart Filtreler
- Durum (aktif, askıda, yasaklı)
- Email onaylı/onaysız
- Kayıt tarihi aralığı
- Son sipariş tarihi aralığı
- Konum (şehir, ülke)

#### İleri Düzey Filtreler
- Toplam harcama aralığı (min-max)
- Sipariş sayısı aralığı
- Bilet sayısı aralığı
- Tercih edilen kategoriler
- RFM Segmentasyonu
  - Recency (son sipariş ne zaman)
  - Frequency (ne sıklıkla alışveriş yapıyor)
  - Monetary (ne kadar harcıyor)

#### Müşteri Segmentleri
- **VIP**: Yüksek harcama, sık alışveriş
- **Regular**: Orta düzey, düzenli müşteri
- **New**: Yeni kayıt, ilk sipariş
- **At Risk**: Eskiden aktif, son zamanlarda inaktif
- **Lost**: Uzun süredir sipariş yok
- **One-Time**: Tek sipariş yapmış

### 4. Müşteri İstatistikleri ve Analitics

#### Dashboard Stats Cards
- Toplam müşteri sayısı
- Aktif müşteriler (son 30 günde sipariş vermiş)
- Bu ay yeni müşteriler
- Toplam revenue (tüm müşterilerden)
- Ortalama sipariş değeri
- Ortalama müşteri başına harcama

#### Grafikler ve Raporlar
- Müşteri büyüme grafiği (zaman içinde kayıt sayısı)
- Müşteri segmentasyonu (pasta grafik)
- En çok harcama yapan top 10 müşteri
- Konum bazlı dağılım (harita)
- Kategori tercihleri (bar chart)
- Müşteri yaş dağılımı
- Aylık retention rate

### 5. Müşteri İşlemleri

#### CRUD Operations
- ✅ Müşteri listele (GET /customers)
- ✅ Müşteri detay görüntüle (GET /customers/:id)
- ✅ Müşteri güncelle (PUT /customers/:id)
  - Kişisel bilgileri güncelleme
  - Durumu değiştirme (askıya alma, aktifleştirme, yasaklama)
  - Marketing tercihlerini güncelleme
- ✅ Müşteri sil (DELETE /customers/:id) - Soft delete
- ❌ Müşteri oluşturma - Admin panelinden değil, frontend'den kayıt

#### Özel İşlemler
- Müşteriye manuel e-posta gönderme
- Müşteri notları ekleme/düzenleme
- Müşteri etiketleri yönetme
- Müşteri siparişlerini görüntüleme
- Müşteri biletlerini görüntüleme
- Şifre sıfırlama linki gönderme
- Hesap doğrulama linki tekrar gönderme

### 6. Toplu İşlemler (Bulk Operations)

- Seçili müşterilere toplu e-posta
- Seçili müşterileri export (CSV/Excel)
- Seçili müşterileri bir segmente ekleme
- Seçili müşterileri askıya alma/aktifleştirme

---

## Sayfa Yapısı

### 1. Müşteriler Liste Sayfası (/customers)

```
┌─────────────────────────────────────────────────────────────────┐
│  Müşteriler                                    [+ Yeni Müşteri]  │
│  Tüm müşterileri görüntüleyin ve yönetin                         │
└─────────────────────────────────────────────────────────────────┘

┌────────────┬────────────┬────────────┬────────────┐
│  Toplam    │   Aktif    │  Bu Ay Yeni│   VIP      │
│   12,458   │   9,234    │     342    │   1,234    │
└────────────┴────────────┴────────────┴────────────┘

[Tümü][Aktif][Askıda][Yasaklı][VIP][Yeni]

[🔍 Müşteri ara...]  [⚙️ Filtreler]  [📊 Export]

┌─────────────────────────────────────────────────────────────────┐
│ ☑ │ Müşteri      │ İletişim     │ Segment │ Siparişler │ Harcama│
│───┼──────────────┼──────────────┼─────────┼────────────┼────────│
│ ☑ │ Ahmet Yılmaz │ +90 532...   │ VIP     │    45      │ 45,670₺│
│   │ ahmet@...    │              │ 🟢      │            │        │
│───┼──────────────┼──────────────┼─────────┼────────────┼────────│
│ ☑ │ Ayşe Kaya    │ +90 533...   │ Regular │    12      │ 5,430₺ │
│   │ ayse@...     │              │ 🟢      │            │        │
└─────────────────────────────────────────────────────────────────┘

[< Önceki]  [1] [2] [3] ... [45]  [Sonraki >]
```

### 2. Müşteri Detay Sayfası (/customers/[id])

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Geri   Ahmet Yılmaz                      [Düzenle] [Askıya Al]│
│  ahmet.yilmaz@gmail.com • +90 532 123 4567                       │
│  🟢 Aktif • VIP Müşteri • Kayıt: 15 Ocak 2024                   │
└─────────────────────────────────────────────────────────────────┘

[Genel][Siparişler][İstatistikler][Aktivite][Notlar]

┌───────────── Genel Bilgiler ─────────────┐
│ 👤 Kişisel Bilgiler                       │
│   • Ad Soyad: Ahmet Yılmaz                │
│   • Email: ahmet.yilmaz@gmail.com ✓       │
│   • Telefon: +90 532 123 4567 ✓          │
│   • Doğum Tarihi: 15 Mart 1990 (34 yaş)  │
│   • Cinsiyet: Erkek                       │
│                                           │
│ 📍 Konum Bilgileri                        │
│   • Şehir: İstanbul                       │
│   • Ülke: Türkiye                         │
│   • Adres: Kadıköy Mah. ...               │
│                                           │
│ 📊 Hesap Bilgileri                        │
│   • Durum: Aktif 🟢                       │
│   • Segment: VIP                          │
│   • Kayıt Tarihi: 15 Ocak 2024            │
│   • Son Giriş: 2 saat önce                │
│   • Email Onaylı: ✓                       │
│   • Telefon Onaylı: ✓                     │
└───────────────────────────────────────────┘

┌───────────── Özet İstatistikler ──────────┐
│  Toplam Sipariş  │  Toplam Bilet  │ Harcama│
│        45        │       67       │ 45,670₺│
│                                            │
│  Etkinlikler     │ Yaklaşan       │ Puan   │
│        38        │       3        │ 4,567  │
└────────────────────────────────────────────┘
```

---

## Backend API Endpoints

### Customers CRUD

```typescript
// 1. Tüm müşterileri listele
GET /customers
Query Params:
  - search: string
  - status: "active" | "suspended" | "banned"
  - segment: "vip" | "regular" | "new" | "inactive"
  - city: string
  - country: string
  - min_spent: number
  - max_spent: number
  - date_from: string (YYYY-MM-DD)
  - date_to: string
  - sort_by: "name" | "created_at" | "total_spent" | "last_order"
  - sort_order: "asc" | "desc"
  - page: number
  - per_page: number

Response: {
  success: true,
  data: Customer[],
  meta: {
    current_page: 1,
    per_page: 20,
    total: 12458,
    last_page: 623
  }
}

// 2. Müşteri detayı
GET /customers/:id
Response: {
  success: true,
  data: Customer (with orders, tickets, stats)
}

// 3. Müşteri güncelle
PUT /customers/:id
Body: {
  name?: string,
  email?: string,
  phone?: string,
  status?: "active" | "suspended" | "banned",
  newsletter_subscribed?: boolean,
  ...
}

// 4. Müşteri sil (soft delete)
DELETE /customers/:id

// 5. Müşteri siparişleri
GET /customers/:id/orders
Query: page, per_page, status

// 6. Müşteri biletleri
GET /customers/:id/tickets
Query: page, per_page, status

// 7. Müşteri istatistikleri
GET /customers/:id/stats
Response: CustomerDetailedStats

// 8. Müşteri aktivite geçmişi
GET /customers/:id/activity
Query: page, per_page, activity_type

// 9. Genel müşteri istatistikleri
GET /customers/stats
Response: CustomerStats

// 10. Top müşteriler (en çok harcama yapanlar)
GET /customers/top-spenders
Query: limit (default: 10)

// 11. Müşteri segmentasyonu
GET /customers/segments
Response: {
  vip: number,
  regular: number,
  new: number,
  at_risk: number,
  lost: number
}

// 12. Müşteri export
GET /customers/export
Query: format ("csv" | "excel"), filters (same as list)
Response: File download

// 13. Bulk operations
POST /customers/bulk-action
Body: {
  action: "suspend" | "activate" | "ban" | "send_email",
  customer_ids: number[],
  data?: any (email content vb.)
}
```

---

## UI Bileşenleri

### Yeni Bileşenler
1. **CustomerCard** - Müşteri özet kartı
2. **CustomerStats** - Müşteri istatistik kartı
3. **CustomerOrderList** - Müşteri sipariş listesi
4. **CustomerTicketList** - Müşteri bilet listesi
5. **CustomerActivityTimeline** - Aktivite zaman çizelgesi
6. **CustomerSegmentBadge** - Segment rozeti
7. **CustomerStatusBadge** - Durum rozeti
8. **CustomerFilters** - Gelişmiş filtre paneli
9. **CustomerExportDialog** - Export dialog
10. **CustomerBulkActionsBar** - Toplu işlem çubuğu

---

## Karşılaştırma: Kullanıcılar vs Müşteriler

| Özellik | Kullanıcılar (Users) | Müşteriler (Customers) |
|---------|---------------------|------------------------|
| **Amaç** | Admin paneli yönetimi | Bilet alan son kullanıcılar |
| **Roller** | super_admin, org_admin, co_admin | Yok (hepsi customer) |
| **CRUD** | Tam yetki | Sadece görüntüleme/güncelleme |
| **Oluşturma** | Admin ekler | Frontend'den kayıt |
| **Siparişler** | Yok | Var - önemli! |
| **Biletler** | Yok | Var - önemli! |
| **İstatistikler** | Basit | Detaylı (harcama, davranış) |
| **Segmentasyon** | Yok | Var (VIP, Regular, New vb.) |
| **Marketing** | Yok | Newsletter, bildirimler |
| **Export** | Yok | CSV/Excel |
| **Bulk Actions** | Yok | Var |

---

## Biletix/Passo Benzeri Özellikler

### Müşteri Profili
- Kişisel bilgiler düzenlenebilir
- Sipariş geçmişi detaylı
- Biletler QR kod ile
- Favori etkinlik kategorileri
- Yaklaşan etkinlik hatırlatmaları

### Segmentasyon ve Analitik
- RFM analizi (Recency, Frequency, Monetary)
- Müşteri lifetime value (CLV)
- Churn prediction (kayıp riski)
- Cohort analizi (aynı dönem kayıt olanlar)

### Marketing Features
- Hedefli kampanyalar
- Doğum günü hatırlatmaları
- Inaktif müşteri geri kazanma
- Loyalty program entegrasyonu

---

## Sonraki Adımlar

1. ✅ Plan onayı
2. Backend API dokümantasyonu detaylandırma
3. Frontend type definitions oluşturma
4. API service katmanı (customersService)
5. UI bileşenleri geliştirme
6. Müşteriler liste sayfası
7. Müşteri detay sayfası
8. İstatistikler ve analitics
9. Export ve bulk operations
10. Test ve deployment

---

Bu planı onaylıyor musunuz? Değiştirmek istediğiniz veya eklemek istediğiniz özellikler var mı?
