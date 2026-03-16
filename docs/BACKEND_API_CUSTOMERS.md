# Backend API Documentation - Müşteriler (Customers)

## Genel Bilgiler

Bu doküman, Biletim Admin Paneli için Müşteriler (Customers) modülünün backend API spesifikasyonunu içerir.

**Base URL:** `https://api.biletim.com/v1`
**API Version:** `1.0.0`
**Content-Type:** `application/json`

## Response Format

### Başarılı Response (200, 201)

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "İşlem başarılı"
}
```

### Hata Response (400, 401, 403, 404, 422, 500)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Hata mesajı",
    "details": {}
  }
}
```

---

## API Endpoints

### 1. Tüm Müşterileri Listele

**Endpoint:** `GET /customers`

**Açıklama:** Tüm müşterileri sayfalama, filtreleme ve sıralama ile listeler.

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| page | integer | Hayır | Sayfa numarası (default: 1) |
| per_page | integer | Hayır | Sayfa başına kayıt (default: 20, max: 100) |
| search | string | Hayır | İsim, e-posta veya telefon ile arama |
| status | string | Hayır | Durum filtresi: active, suspended, banned |
| segment | string | Hayır | Segment filtresi: vip, regular, new, at_risk, lost, one_time |
| sort_by | string | Hayır | Sıralama alanı: name, total_spent, total_orders, created_at |
| sort_order | string | Hayır | Sıralama yönü: asc, desc (default: desc) |
| city | string | Hayır | Şehir filtresi |
| country | string | Hayır | Ülke filtresi |
| min_spent | number | Hayır | Minimum harcama filtresi |
| max_spent | number | Hayır | Maksimum harcama filtresi |
| date_from | string | Hayır | Başlangıç tarihi (YYYY-MM-DD) |
| date_to | string | Hayır | Bitiş tarihi (YYYY-MM-DD) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Ahmet Yılmaz",
        "email": "ahmet@example.com",
        "phone": "+905551234567",
        "avatar": "https://cdn.biletim.com/avatars/1.jpg",
        "city": "İstanbul",
        "country": "Türkiye",
        "status": "active",
        "customer_segment": "vip",
        "total_orders": 15,
        "total_spent": 12500.50,
        "total_tickets": 32,
        "events_attended": 12,
        "last_order_date": "2025-03-10T18:30:00Z",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. Müşteri Detayı Getir

**Endpoint:** `GET /customers/{id}`

**Açıklama:** Belirli bir müşterinin detaylı bilgilerini getirir.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "phone": "+905551234567",
    "avatar": "https://cdn.biletim.com/avatars/1.jpg",
    "gender": "male",
    "birth_date": "1990-05-15",
    "city": "İstanbul",
    "country": "Türkiye",
    "address": "Bağdat Caddesi No: 123, Kadıköy",
    "status": "active",
    "customer_segment": "vip",
    "total_orders": 15,
    "total_spent": 12500.50,
    "total_tickets": 32,
    "events_attended": 12,
    "average_order_value": 833.37,
    "last_order_date": "2025-03-10T18:30:00Z",
    "last_login": "2025-03-15T14:20:00Z",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2025-03-10T18:30:00Z",
    "favorite_categories": [
      {
        "id": 1,
        "name": "Konser",
        "order_count": 8
      },
      {
        "id": 2,
        "name": "Tiyatro",
        "order_count": 4
      }
    ],
    "favorite_venues": [
      {
        "id": 1,
        "name": "Harbiye Açık Hava Tiyatrosu",
        "visit_count": 5
      }
    ],
    "notes": "VIP müşteri, özel ilgi gerektiriyor"
  }
}
```

---

### 3. Müşteri Güncelle

**Endpoint:** `PUT /customers/{id}`

**Açıklama:** Müşteri bilgilerini günceller.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Request Body:**

```json
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet.yilmaz@example.com",
  "phone": "+905551234567",
  "gender": "male",
  "birth_date": "1990-05-15",
  "city": "İstanbul",
  "country": "Türkiye",
  "address": "Bağdat Caddesi No: 123, Kadıköy",
  "status": "active",
  "customer_segment": "vip",
  "notes": "VIP müşteri, özel ilgi gerektiriyor"
}
```

**Validation Rules:**

| Alan | Kurallar |
|------|----------|
| name | Minimum 2 karakter, maksimum 100 karakter |
| email | Geçerli e-posta formatı, unique |
| phone | Geçerli telefon formatı, unique (opsiyonel) |
| gender | male, female, other, null |
| birth_date | Geçerli tarih formatı (YYYY-MM-DD), null olabilir |
| city | Maksimum 100 karakter |
| country | Maksimum 100 karakter |
| address | Maksimum 500 karakter |
| status | active, suspended, banned |
| customer_segment | vip, regular, new, at_risk, lost, one_time |
| notes | Maksimum 2000 karakter |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ahmet Yılmaz",
    "email": "ahmet.yilmaz@example.com",
    "phone": "+905551234567",
    "gender": "male",
    "birth_date": "1990-05-15",
    "city": "İstanbul",
    "country": "Türkiye",
    "address": "Bağdat Caddesi No: 123, Kadıköy",
    "status": "active",
    "customer_segment": "vip",
    "notes": "VIP müşteri, özel ilgi gerektiriyor",
    "updated_at": "2025-03-16T10:30:00Z"
  },
  "message": "Müşteri bilgileri güncellendi"
}
```

---

### 4. Müşteri Sil

**Endpoint:** `DELETE /customers/{id}`

**Açıklama:** Müşteriyi soft delete ile siler (isActive = false).

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Müşteri başarıyla silindi"
}
```

---

### 5. Müşteri Siparişlerini Getir

**Endpoint:** `GET /customers/{id}/orders`

**Açıklama:** Belirli bir müşterinin siparişlerini listeler.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| page | integer | Hayır | Sayfa numarası (default: 1) |
| per_page | integer | Hayır | Sayfa başına kayıt (default: 20) |
| status | string | Hayır | Sipariş durumu: pending, completed, cancelled, refunded |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1001,
        "order_number": "ORD-2025-0310-001",
        "event": {
          "id": 45,
          "name": "Tarkan Konseri",
          "venue": "Harbiye Açık Hava",
          "date": "2025-04-15T20:00:00Z",
          "image": "https://cdn.biletim.com/events/45.jpg"
        },
        "ticket_count": 2,
        "total_amount": 1500.00,
        "status": "completed",
        "payment_method": "credit_card",
        "created_at": "2025-03-10T18:30:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

---

### 6. Müşteri Biletlerini Getir

**Endpoint:** `GET /customers/{id}/tickets`

**Açıklama:** Belirli bir müşterinin biletlerini listeler.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| page | integer | Hayır | Sayfa numarası (default: 1) |
| per_page | integer | Hayır | Sayfa başına kayıt (default: 20) |
| status | string | Hayır | Bilet durumu: valid, used, cancelled, expired |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": 5001,
        "ticket_number": "TKT-2025-0415-0001",
        "event": {
          "id": 45,
          "name": "Tarkan Konseri",
          "venue": "Harbiye Açık Hava",
          "date": "2025-04-15T20:00:00Z"
        },
        "ticket_type": {
          "name": "VIP Kategori",
          "price": 750.00
        },
        "seat": "A-15",
        "qr_code": "https://api.biletim.com/qr/5001.png",
        "status": "valid",
        "used_at": null,
        "created_at": "2025-03-10T18:30:00Z"
      }
    ],
    "pagination": {
      "total": 32,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 2
    }
  }
}
```

---

### 7. Müşteri Aktivitesini Getir

**Endpoint:** `GET /customers/{id}/activity`

**Açıklama:** Belirli bir müşterinin aktivite geçmişini listeler.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| page | integer | Hayır | Sayfa numarası (default: 1) |
| per_page | integer | Hayır | Sayfa başına kayıt (default: 20) |
| type | string | Hayır | Aktivite tipi: login, order, ticket_use, cancellation, review |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "type": "order",
        "description": "Tarkan Konseri için 2 adet bilet satın alındı",
        "metadata": {
          "order_id": 1001,
          "amount": 1500.00
        },
        "ip_address": "85.99.123.45",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2025-03-10T18:30:00Z"
      },
      {
        "id": 2,
        "type": "login",
        "description": "Sisteme giriş yapıldı",
        "metadata": {},
        "ip_address": "85.99.123.45",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2025-03-15T14:20:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "per_page": 20,
      "current_page": 1,
      "total_pages": 3
    }
  }
}
```

---

### 8. Müşteri İstatistiklerini Getir

**Endpoint:** `GET /customers/{id}/stats`

**Açıklama:** Belirli bir müşterinin detaylı istatistiklerini getirir.

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| id | integer | Evet | Müşteri ID |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "total_orders": 15,
    "total_spent": 12500.50,
    "total_tickets": 32,
    "events_attended": 12,
    "average_order_value": 833.37,
    "average_tickets_per_order": 2.13,
    "favorite_categories": [
      {
        "category": "Konser",
        "count": 8,
        "percentage": 53.33
      },
      {
        "category": "Tiyatro",
        "count": 4,
        "percentage": 26.67
      }
    ],
    "favorite_venues": [
      {
        "venue": "Harbiye Açık Hava Tiyatrosu",
        "count": 5
      }
    ],
    "monthly_spending": [
      {
        "month": "2024-01",
        "amount": 1500.00
      },
      {
        "month": "2024-02",
        "amount": 800.00
      }
    ],
    "last_order_date": "2025-03-10T18:30:00Z",
    "first_order_date": "2024-01-20T14:00:00Z",
    "days_since_last_order": 6
  }
}
```

---

### 9. Genel Müşteri İstatistikleri

**Endpoint:** `GET /customers/stats/general`

**Açıklama:** Tüm müşteriler için genel istatistikleri getirir.

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| date_from | string | Hayır | Başlangıç tarihi (YYYY-MM-DD) |
| date_to | string | Hayır | Bitiş tarihi (YYYY-MM-DD) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "total_customers": 1250,
    "active_customers": 1100,
    "suspended_customers": 100,
    "banned_customers": 50,
    "vip_customers": 150,
    "new_customers_this_month": 45,
    "total_revenue": 1250000.50,
    "total_tickets_sold": 8500,
    "average_customer_value": 1000.00,
    "customer_segments": {
      "vip": 150,
      "regular": 600,
      "new": 200,
      "at_risk": 150,
      "lost": 100,
      "one_time": 50
    },
    "top_cities": [
      {
        "city": "İstanbul",
        "count": 450
      },
      {
        "city": "Ankara",
        "count": 200
      }
    ]
  }
}
```

---

### 10. En Çok Harcama Yapan Müşteriler

**Endpoint:** `GET /customers/stats/top-spenders`

**Açıklama:** En çok harcama yapan müşterileri listeler.

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| limit | integer | Hayır | Kayıt sayısı (default: 10, max: 50) |
| date_from | string | Hayır | Başlangıç tarihi (YYYY-MM-DD) |
| date_to | string | Hayır | Bitiş tarihi (YYYY-MM-DD) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "top_spenders": [
      {
        "id": 1,
        "name": "Ahmet Yılmaz",
        "email": "ahmet@example.com",
        "avatar": "https://cdn.biletim.com/avatars/1.jpg",
        "total_spent": 12500.50,
        "total_orders": 15,
        "average_order_value": 833.37
      }
    ]
  }
}
```

---

### 11. Müşteri Segmentasyonu

**Endpoint:** `GET /customers/stats/segmentation`

**Açıklama:** Müşteri segmentasyon dağılımını getirir.

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| date_from | string | Hayır | Başlangıç tarihi (YYYY-MM-DD) |
| date_to | string | Hayır | Bitiş tarihi (YYYY-MM-DD) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "segments": [
      {
        "segment": "vip",
        "count": 150,
        "percentage": 12.0,
        "total_revenue": 450000.00,
        "average_spent": 3000.00
      },
      {
        "segment": "regular",
        "count": 600,
        "percentage": 48.0,
        "total_revenue": 600000.00,
        "average_spent": 1000.00
      }
    ]
  }
}
```

---

### 12. Müşteri Dışa Aktar

**Endpoint:** `GET /customers/export`

**Açıklama:** Müşteri listesini CSV veya Excel formatında dışa aktarır.

**Query Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| format | string | Hayır | Dosya formatı: csv, xlsx (default: csv) |
| filters | object | Hayır | Filtre objesi (liste endpointi ile aynı) |

**Response (200 OK):**

CSV veya Excel dosyası olarak download.

---

### 13. Toplu İşlem (Bulk Action)

**Endpoint:** `POST /customers/bulk`

**Açıklama:** Seçili müşteriler üzerinde toplu işlem yapar.

**Request Body:**

```json
{
  "action": "suspend",
  "customer_ids": [1, 2, 3, 4, 5],
  "reason": "Güvenlik önlemi"
}
```

**İşlem Türleri:**

| Action | Açıklama |
|--------|----------|
| suspend | Müşterileri askıya alır |
| activate | Müşterileri aktif eder |
| ban | Müşterileri yasaklar |
| change_segment | Segment değiştirir |
| export | Seçili müşterileri dışa aktarır |
| delete | Müşterileri siler (soft delete) |

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "processed": 5,
    "failed": 0,
    "results": [
      {
        "customer_id": 1,
        "status": "success"
      }
    ]
  },
  "message": "5 müşteri başarıyla işlendi"
}
```

---

## Yetkilendirme Matrisi

| Endpoint | Super Admin | Org Admin | Co-Admin |
|----------|-------------|-----------|----------|
| GET /customers | ✅ | ✅ | ✅ |
| GET /customers/{id} | ✅ | ✅ | ✅ |
| PUT /customers/{id} | ✅ | ❌ | ❌ |
| DELETE /customers/{id} | ✅ | ❌ | ❌ |
| GET /customers/{id}/orders | ✅ | ✅ | ✅ |
| GET /customers/{id}/tickets | ✅ | ✅ | ✅ |
| GET /customers/{id}/activity | ✅ | ✅ | ✅ |
| GET /customers/{id}/stats | ✅ | ✅ | ✅ |
| GET /customers/stats/* | ✅ | ✅ | ✅ |
| GET /customers/export | ✅ | ✅ | ❌ |
| POST /customers/bulk | ✅ | ❌ | ❌ |

---

## Teknik Notlar

### 1. Müşteri Segmentasyon Mantığı

**VIP (vip):**
- Toplam harcama > 10.000 TL VE
- Son 3 ayda en az 2 sipariş

**Regular (regular):**
- Toplam harcama 1.000 - 10.000 TL VE
- Son 6 ayda en az 1 sipariş

**New (new):**
- Kayıt tarihi < 30 gün

**At Risk (at_risk):**
- Son sipariş tarihi > 60 gün önce VE
- Toplam harcama > 500 TL

**Lost (lost):**
- Son sipariş tarihi > 180 gün önce

**One-Time (one_time):**
- Toplam sipariş sayısı = 1 VE
- Kayıt tarihi > 30 gün

### 2. Cascade Silme Kontrolü

Müşteri silindiğinde:
- Siparişler korunur (customer_id null olmaz)
- Biletler korunur
- Aktivite kayıtları korunur
- Müşteri sadece soft delete ile silinir (isActive = false)

### 3. Pagination

Tüm liste endpoint'leri pagination destekler:
- Default per_page: 20
- Max per_page: 100
- Response'da pagination bilgisi zorunlu

### 4. Search/Filter

Arama parametreleri:
- search: İsim, e-posta, telefon alanlarında arama
- Filtreler AND ile birleştirilir
- Tarih aralıkları date_from ve date_to ile belirtilir

### 5. Rate Limiting

- Auth endpoint'leri: 15 request/dakika
- List endpoint'leri: 100 request/dakika
- Diğer endpoint'ler: 60 request/dakika

### 6. CORS

İzin verilen origin'ler:
- https://admin.biletim.com
- https://biletim.com

### 7. Error Handling

**Hata Kodları:**

| Kod | Açıklama |
|-----|----------|
| CUSTOMER_NOT_FOUND | Müşteri bulunamadı |
| INVALID_EMAIL | Geçersiz e-posta formatı |
| EMAIL_ALREADY_EXISTS | E-posta zaten kullanımda |
| PHONE_ALREADY_EXISTS | Telefon zaten kullanımda |
| INVALID_STATUS | Geçersiz durum değeri |
| INVALID_SEGMENT | Geçersiz segment değeri |
| INVALID_DATE_RANGE | Geçersiz tarih aralığı |
| BULK_ACTION_FAILED | Toplu işlem başarısız |
| UNAUTHORIZED | Yetkisiz erişim |
| FORBIDDEN | İşleme izin verilmiyor |

### 8. Logging

Tüm işlemler loglanmalı:
- Müşteri görüntüleme
- Müşteri güncelleme
- Müşteri silme
- Toplu işlemler
- Dışa aktarma işlemleri

Log içeriği:
- Kullanıcı ID
- İşlem tipi
- IP adresi
- Timestamp
- İşlem detayları

---

## Test Senaryoları

### Müşteri Listesi

**Request:**
```http
GET /customers?page=1&per_page=20&status=active&sort_by=total_spent&sort_order=desc
```

**Expected Response:** 200 OK with active customers sorted by total spent

### Müşteri Detayı

**Request:**
```http
GET /customers/1
```

**Expected Response:** 200 OK with customer details

### Müşteri Güncelleme

**Request:**
```http
PUT /customers/1
Content-Type: application/json

{
  "name": "Ahmet Yılmaz",
  "email": "ahmet.yilmaz@example.com",
  "status": "active",
  "customer_segment": "vip"
}
```

**Expected Response:** 200 OK with updated customer

### Validation Error (422)

**Request:**
```http
PUT /customers/1
Content-Type: application/json

{
  "email": "invalid-email"
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Geçersiz e-posta formatı",
    "details": {
      "field": "email"
    }
  }
}
```

### Authorization Error (403)

**Request:**
```http
DELETE /customers/1
```
(As Org Admin)

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Bu işleme yetkiniz yok"
  }
}
```

### Not Found Error (404)

**Request:**
```http
GET /customers/999999
```

**Expected Response:**
```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Müşteri bulunamadı"
  }
}
```

---

## İletişim

Backend API ile ilgili sorularınız için:
- Email: api@biletim.com
- Slack: #backend-api
- Jira: BILETIM-BE
