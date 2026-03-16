# Backend API Documentation - Mekanlar ve Organizatörler

## Genel Bilgiler

Bu doküman, Biletim Admin panelindeki Mekanlar ve Organizatörler yönetimi için gerekli backend API endpoint'lerini detaylandırır.

**Base URL**: `https://api.biletleme.com/api/v1`

**Kimlik Doğrulama**: Bearer Token (Authorization header'ında gönderilir)

```
Authorization: Bearer {access_token}
```

## Response Format

Tüm API response'ları aşağıdaki formatta olmalıdır:

### Başarılı Response (200, 201)
```json
{
  "success": true,
  "data": {
    // Response data burada
  },
  "message": "İşlem başarılı" // Opsiyonel
}
```

### Hata Response (400, 401, 403, 404, 422, 500)
```json
{
  "success": false,
  "message": "Hata mesajı",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

## Organizatörler API Endpoints

### 1. Tüm Organizatörleri Listele

**GET** `/organizations`

Kullanıcının yetkisine göre organizasyonları listeler:
- **SUPER_ADMIN**: Tüm organizasyonlar
- **ORG_ADMIN**: Sadece kendi organizasyonu
- **CO_ADMIN**: Atandığı organizasyonlar

**Query Parameters**:
```typescript
{
  search?: string;        // Organizatör adı veya açıklamada arama
  status?: "active" | "inactive" | "suspended";
  page?: number;          // Default: 1
  per_page?: number;      // Default: 20
}
```

**Request Example**:
```bash
GET /organizations?search=BKM&status=active&page=1&per_page=20
Authorization: Bearer {token}
```

**Response Example (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "BKM",
      "slug": "bkm",
      "description": "Büyük Kültür Yolu",
      "logo": "https://cdn.biletleme.com/logos/bkm.jpg",
      "address": "Harbiye Mahallesi, İstanbul",
      "phone": "+90 212 123 4567",
      "email": "info@bkm.com.tr",
      "website": "https://www.bkm.com.tr",
      "city": "İstanbul",
      "country": "Türkiye",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 50,
    "last_page": 3
  }
}
```

---

### 2. Organizasyon Detayı Getir

**GET** `/organizations/{id}`

Belirli bir organizasyonun detaylarını getirir.

**Path Parameters**:
- `id` (integer, required): Organizasyon ID

**Request Example**:
```bash
GET /organizations/1
Authorization: Bearer {token}
```

**Response Example (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "BKM",
    "slug": "bkm",
    "description": "Büyük Kültür Yolu",
    "logo": "https://cdn.biletleme.com/logos/bkm.jpg",
    "address": "Harbiye Mahallesi, İstanbul",
    "phone": "+90 212 123 4567",
    "email": "info@bkm.com.tr",
    "website": "https://www.bkm.com.tr",
    "city": "İstanbul",
    "country": "Türkiye",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Organizatör bulunamadı
- `403 Forbidden`: Bu organizatörü görüntüleme yetkiniz yok

---

### 3. Yeni Organizatör Oluştur

**POST** `/organizations`

Yeni bir organizasyon oluşturur. **Sadece SUPER_ADMIN yetkisi gereklidir.**

**Request Body**:
```json
{
  "name": "Zorlu PSM",
  "description": "Zorlu Performing Arts Center",
  "address": "Zorlu Center, Beşiktaş",
  "phone": "+90 212 987 6543",
  "email": "info@zorlupms.com",
  "website": "https://www.zorlupms.com",
  "city": "İstanbul",
  "country": "Türkiye"
}
```

**Validation Rules**:
- `name` (required, string, min: 2, max: 255): Organizatör adı
- `description` (optional, string, max: 1000): Açıklama
- `address` (optional, string, max: 500): Adres
- `phone` (optional, string, max: 20): Telefon numarası
- `email` (optional, email, max: 255): E-posta adresi
- `website` (optional, url, max: 255): Website URL
- `city` (optional, string, max: 100): Şehir
- `country` (optional, string, max: 100): Ülke

**Request Example**:
```bash
POST /organizations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Zorlu PSM",
  "description": "Zorlu Performing Arts Center",
  "city": "İstanbul",
  "country": "Türkiye"
}
```

**Response Example (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Zorlu PSM",
    "slug": "zorlu-psm",
    "description": "Zorlu Performing Arts Center",
    "logo": null,
    "address": null,
    "phone": null,
    "email": null,
    "website": null,
    "city": "İstanbul",
    "country": "Türkiye",
    "status": "active",
    "created_at": "2024-03-16T13:52:00Z",
    "updated_at": "2024-03-16T13:52:00Z"
  },
  "message": "Organizatör başarıyla oluşturuldu"
}
```

**Error Responses**:
- `422 Unprocessable Entity`: Validation hataları
- `403 Forbidden`: Bu işlem için yetkiniz yok
- `409 Conflict`: Bu isimde bir organizasyon zaten var

---

### 4. Organizasyonu Güncelle

**PUT/PATCH** `/organizations/{id}`

Mevcut bir organizasyonu günceller.

**Path Parameters**:
- `id` (integer, required): Organizasyon ID

**Request Body**: (Tüm alanlar opsiyonel)
```json
{
  "name": "BKM",
  "description": "Güncellenmiş açıklama",
  "address": "Yeni adres",
  "phone": "+90 212 123 4567",
  "email": "yeni@email.com",
  "website": "https://www.yenisite.com",
  "city": "İstanbul",
  "country": "Türkiye",
  "status": "active"
}
```

**Validation Rules**: (Oluşturma ile aynı, hepsi opsiyonel)
- `status` (optional, enum): "active", "inactive", "suspended"

**Request Example**:
```bash
PUT /organizations/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Güncellenmiş açıklama",
  "phone": "+90 212 999 8888"
}
```

**Response Example (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "BKM",
    "slug": "bkm",
    "description": "Güncellenmiş açıklama",
    "logo": "https://cdn.biletleme.com/logos/bkm.jpg",
    "address": "Harbiye Mahallesi, İstanbul",
    "phone": "+90 212 999 8888",
    "email": "info@bkm.com.tr",
    "website": "https://www.bkm.com.tr",
    "city": "İstanbul",
    "country": "Türkiye",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-03-16T13:55:00Z"
  },
  "message": "Organizatör başarıyla güncellendi"
}
```

**Error Responses**:
- `404 Not Found`: Organizatör bulunamadı
- `422 Unprocessable Entity`: Validation hataları
- `403 Forbidden`: Bu organizasyonu güncelleme yetkiniz yok

---

### 5. Organizasyonu Sil

**DELETE** `/organizations/{id}`

Bir organizasyonu siler. **Sadece SUPER_ADMIN yetkisi gereklidir.**

**Path Parameters**:
- `id` (integer, required): Organizasyon ID

**Request Example**:
```bash
DELETE /organizations/1
Authorization: Bearer {token}
```

**Response Example (200 OK)**:
```json
{
  "success": true,
  "message": "Organizatör başarıyla silindi"
}
```

**Error Responses**:
- `404 Not Found`: Organizasyon bulunamadı
- `403 Forbidden`: Bu organizasyonu silme yetkiniz yok
- `409 Conflict`: Bu organizasyona bağlı mekanlar veya etkinlikler var

**Not**: Organizasyon silinmeden önce, ona bağlı tüm mekanlar ve etkinlikler kontrol edilmelidir. Bağlı kayıtlar varsa silme işlemi engellenmelidir.

---

### 6. Organizasyon İstatistikleri

**GET** `/organizations/{id}/stats`

Bir organizasyonun istatistiklerini getirir.

**Path Parameters**:
- `id` (integer, required): Organizasyon ID

**Request Example**:
```bash
GET /organizations/1/stats
Authorization: Bearer {token}
```

**Response Example (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total_events": 45,
    "active_events": 12,
    "total_venues": 3,
    "total_orders": 1250,
    "total_revenue": 450000.00
  }
}
```

---

## Mekanlar API Endpoints

### 7. Tüm Mekanları Listele

**GET** `/venues`

Tüm mekanları listeler. Mekanlar organizasyonlardan bağımsızdır.

**Query Parameters**:
```typescript
{
  city?: string;            // Şehre göre filtre
  country?: string;         // Ülkeye göre filtre
  status?: "active" | "inactive" | "maintenance";
  search?: string;          // Mekan adı veya adreste arama
  page?: number;            // Default: 1
  per_page?: number;        // Default: 20
}
```

**Request Example**:
```bash
GET /venues?city=İstanbul&status=active&page=1
Authorization: Bearer {token}
```

**Response Example (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Harbiye Açık Hava Tiyatrosu",
      "slug": "harbiye-acik-hava-tiyatrosu",
      "address": "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
      "city": "İstanbul",
      "country": "Türkiye",
      "capacity": 7000,
      "latitude": 41.046488,
      "longitude": 28.994238,
      "description": "İstanbul'un en büyük açık hava mekanlarından biri",
      "image": "https://cdn.biletleme.com/venues/harbiye.jpg",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 85,
    "last_page": 5
  }
}
```

---

### 8. Mekan Detayı Getir

**GET** `/venues/{id}`

Belirli bir mekanın detaylarını getirir.

**Path Parameters**:
- `id` (integer, required): Mekan ID

**Request Example**:
```bash
GET /venues/1
Authorization: Bearer {token}
```

**Response Example (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Harbiye Açık Hava Tiyatrosu",
    "slug": "harbiye-acik-hava-tiyatrosu",
    "address": "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
    "city": "İstanbul",
    "country": "Türkiye",
    "capacity": 7000,
    "latitude": 41.046488,
    "longitude": 28.994238,
    "description": "İstanbul'un en büyük açık hava mekanlarından biri",
    "image": "https://cdn.biletleme.com/venues/harbiye.jpg",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `404 Not Found`: Mekan bulunamadı
- `403 Forbidden`: Bu mekanı görüntüleme yetkiniz yok

---

### 9. Yeni Mekan Oluştur

**POST** `/venues`

Yeni bir mekan oluşturur. Mekanlar organizasyonlardan bağımsızdır.

**Request Body**:
```json
{
  "name": "Yeni Konser Salonu",
  "address": "Kadıköy Mahallesi, Söğütlüçeşme Caddesi No: 120",
  "city": "İstanbul",
  "country": "Türkiye",
  "capacity": 2500,
  "latitude": 40.991859,
  "longitude": 29.025986,
  "description": "Modern akustik sistemli konser salonu"
}
```

**Validation Rules**:
- `name` (required, string, min: 2, max: 255): Mekan adı
- `address` (required, string, max: 500): Adres
- `city` (required, string, max: 100): Şehir
- `country` (required, string, max: 100): Ülke
- `capacity` (required, integer, min: 1): Kapasite
- `latitude` (optional, numeric, between: -90,90): Enlem
- `longitude` (optional, numeric, between: -180,180): Boylam
- `description` (optional, string, max: 2000): Açıklama

**Request Example**:
```bash
POST /venues
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Yeni Konser Salonu",
  "address": "Kadıköy Mahallesi, İstanbul",
  "city": "İstanbul",
  "country": "Türkiye",
  "capacity": 2500
}
```

**Response Example (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "Yeni Konser Salonu",
    "slug": "yeni-konser-salonu",
    "address": "Kadıköy Mahallesi, İstanbul",
    "city": "İstanbul",
    "country": "Türkiye",
    "capacity": 2500,
    "latitude": null,
    "longitude": null,
    "description": null,
    "image": null,
    "status": "active",
    "created_at": "2024-03-16T13:52:00Z",
    "updated_at": "2024-03-16T13:52:00Z"
  },
  "message": "Mekan başarıyla oluşturuldu"
}
```

**Error Responses**:
- `422 Unprocessable Entity`: Validation hataları
- `403 Forbidden`: Mekan oluşturma yetkiniz yok
- `409 Conflict`: Bu isimde bir mekan zaten var

---

### 10. Mekanı Güncelle

**PUT/PATCH** `/venues/{id}`

Mevcut bir mekanı günceller.

**Path Parameters**:
- `id` (integer, required): Mekan ID

**Request Body**: (Tüm alanlar opsiyonel)
```json
{
  "name": "Güncellenmiş Mekan Adı",
  "address": "Yeni adres",
  "city": "Ankara",
  "country": "Türkiye",
  "capacity": 3000,
  "latitude": 39.925533,
  "longitude": 32.866287,
  "description": "Güncellenmiş açıklama",
  "status": "active"
}
```

**Validation Rules**: (Oluşturma ile aynı, hepsi opsiyonel)
- `status` (optional, enum): "active", "inactive", "maintenance"

**Request Example**:
```bash
PUT /venues/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "capacity": 7500,
  "description": "Güncellenmiş açıklama"
}
```

**Response Example (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Harbiye Açık Hava Tiyatrosu",
    "slug": "harbiye-acik-hava-tiyatrosu",
    "address": "Harbiye Mahallesi, Şükrü Sina Güzel Sokak",
    "city": "İstanbul",
    "country": "Türkiye",
    "capacity": 7500,
    "latitude": 41.046488,
    "longitude": 28.994238,
    "description": "Güncellenmiş açıklama",
    "image": "https://cdn.biletleme.com/venues/harbiye.jpg",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-03-16T13:55:00Z"
  },
  "message": "Mekan başarıyla güncellendi"
}
```

**Error Responses**:
- `404 Not Found`: Mekan bulunamadı
- `422 Unprocessable Entity`: Validation hataları
- `403 Forbidden`: Bu mekanı güncelleme yetkiniz yok

---

### 11. Mekanı Sil

**DELETE** `/venues/{id}`

Bir mekanı siler.

**Path Parameters**:
- `id` (integer, required): Mekan ID

**Request Example**:
```bash
DELETE /venues/1
Authorization: Bearer {token}
```

**Response Example (200 OK)**:
```json
{
  "success": true,
  "message": "Mekan başarıyla silindi"
}
```

**Error Responses**:
- `404 Not Found`: Mekan bulunamadı
- `403 Forbidden`: Bu mekanı silme yetkiniz yok
- `409 Conflict`: Bu mekanda planlı etkinlikler var

**Not**: Mekan silinmeden önce, ona bağlı aktif veya gelecek tarihli etkinlikler kontrol edilmelidir. Varsa silme işlemi engellenmelidir.

---

### 12. Organizasyona Göre Etkinlikleri Listele

**GET** `/organizations/{organization_id}/events`

Belirli bir organizasyonun tüm etkinliklerini listeler.

**Path Parameters**:
- `organization_id` (integer, required): Organizasyon ID

**Query Parameters**:
```typescript
{
  venue_id?: number;        // Belirli bir mekan için
  status?: "draft" | "published" | "cancelled" | "completed" | "ongoing";
  page?: number;
  per_page?: number;
}
```

**Request Example**:
```bash
GET /organizations/1/events?status=published
Authorization: Bearer {token}
```

**Response Example (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "organization_id": 1,
      "venue_id": 1,
      "title": "Sezen Aksu Konseri",
      "start_date": "2024-06-15T20:00:00Z",
      "status": "published"
    },
    {
      "id": 2,
      "organization_id": 1,
      "venue_id": 2,
      "title": "Cem Yılmaz Stand-Up",
      "start_date": "2024-07-01T21:00:00Z",
      "status": "published"
    }
  ]
}
```

---

## Yetkilendirme Matrisi

| Endpoint | SUPER_ADMIN | ORG_ADMIN | CO_ADMIN |
|----------|-------------|-----------|----------|
| GET /organizations | Tüm org. | Kendi org. | Atandığı org. |
| GET /organizations/{id} | ✅ | Kendi org. | Atandığı org. |
| POST /organizations | ✅ | ❌ | ❌ |
| PUT /organizations/{id} | ✅ | Kendi org. | ❌ |
| DELETE /organizations/{id} | ✅ | ❌ | ❌ |
| GET /venues | Tüm mekan | Tüm mekan | Tüm mekan |
| GET /venues/{id} | ✅ | ✅ | ✅ |
| POST /venues | ✅ | ✅ | ❌ |
| PUT /venues/{id} | ✅ | ✅ | ❌ |
| DELETE /venues/{id} | ✅ | ✅ | ❌ |

---

## Önemli Notlar

### 1. Slug Oluşturma
- Her organizasyon ve mekan için benzersiz bir slug otomatik oluşturulmalıdır
- Slug, name alanından türetilir (küçük harf, boşluklar tire ile değiştirilir, Türkçe karakterler dönüştürülür)
- Örnek: "BKM" → "bkm"

### 2. Cascade Silme Kontrolü
- Organizatör silinmeden önce bağlı mekanlar kontrol edilmeli
- Mekan silinmeden önce bağlı etkinlikler kontrol edilmeli
- Aktif bağlantılar varsa silme işlemi `409 Conflict` hatası ile reddedilmeli

### 3. Pagination
- Varsayılan sayfa boyutu: 20 kayıt
- Maksimum sayfa boyutu: 100 kayıt
- Response'da meta bilgisi olmalı (current_page, per_page, total, last_page)

### 4. Search/Filter
- Search parametresi case-insensitive olmalı
- Türkçe karakterler düzgün handle edilmeli
- Birden fazla filtre birlikte kullanılabilmeli (AND mantığı)

### 5. Rate Limiting
- Her endpoint için dakikada maksimum 60 istek
- Aşılırsa `429 Too Many Requests` hatası

### 6. CORS
- Admin panel domain'i (https://admin.biletleme.com) whitelist'te olmalı
- Credentials (cookies) gönderimine izin verilmeli

### 7. Error Handling
- Tüm hatalar tutarlı formatta dönülmeli
- Validation hataları field bazında detaylandırılmalı
- Stack trace production'da gösterilmemeli

### 8. Logging
- Tüm CRUD operasyonları loglanmalı
- Hangi kullanıcının ne zaman ne yaptığı kaydedilmeli
- Soft delete yapıldıysa kimler tarafından silindiği izlenebilmeli

---

## Test Senaryoları

### Organizasyon Testleri
1. ✅ SUPER_ADMIN tüm organizasyonları görebilir
2. ✅ ORG_ADMIN sadece kendi organizasyonunu görebilir
3. ✅ SUPER_ADMIN yeni organizasyon oluşturabilir
4. ✅ ORG_ADMIN organizasyon oluşturamaz
5. ✅ Organizasyon silinmeye çalışıldığında bağlı mekanlar kontrol edilir
6. ✅ Aynı isimde organizasyon oluşturulamaz

### Mekan Testleri
1. ✅ SUPER_ADMIN tüm mekanları görebilir
2. ✅ ORG_ADMIN tüm mekanları görebilir
3. ✅ CO_ADMIN tüm mekanları görebilir
4. ✅ SUPER_ADMIN mekan oluşturabilir
5. ✅ ORG_ADMIN mekan oluşturabilir
6. ✅ CO_ADMIN mekan oluşturamaz
7. ✅ Mekan silinmeye çalışıldığında bağlı etkinlikler kontrol edilir
8. ✅ Kapasite negatif olamaz
9. ✅ Enlem/Boylam değerleri geçerli aralıkta olmalı
10. ✅ Aynı mekan birden fazla organizatör tarafından kullanılabilir

---

## Örnek Hata Response'ları

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validasyon hatası",
  "errors": {
    "name": ["İsim alanı zorunludur"],
    "capacity": ["Kapasite en az 1 olmalıdır"],
    "email": ["Geçerli bir e-posta adresi giriniz"]
  }
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Bu işlem için yetkiniz yok"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Mekan bulunamadı"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "Bu organizasyona bağlı 3 mekan var. Önce mekanları silmelisiniz."
}
```

---

## İletişim

Sorular veya ek gereksinimler için:
- Backend Developer: backend@biletleme.com
- Frontend Developer: frontend@biletleme.com
- Proje Yöneticisi: pm@biletleme.com
