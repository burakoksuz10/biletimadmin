# Mekanlar ve Organizasyonlar Yönetim Planı

## Genel Bakış

Bu plan, Biletim Admin panelindeki mekanlar ve organizasyonlar için tam CRUD (Create, Read, Update, Delete) işlevselliğini oluşturmayı kapsar.

## Mevcut Durum Analizi

### Var olan Bileşenler
- **Venues Sayfası**: [`src/app/(dashboard)/venues/page.tsx`](src/app/(dashboard)/venues/page.tsx) - Listeleme ve filtreleme hazır
- **Organizations Sayfası**: [`src/app/(dashboard)/organizations/page.tsx`](src/app/(dashboard)/organizations/page.tsx) - Listeleme ve filtreleme hazır
- **API Servisleri**: [`venues.service.ts`](src/lib/api/services/venues.service.ts) ve [`organizations.service.ts`](src/lib/api/services/organizations.service.ts) hazır
- **Tip Tanımları**: [`biletleme.types.ts`](src/lib/api/types/biletleme.types.ts) içinde tüm tipler tanımlı

### Eksik Bileşenler
- Form validasyon şemaları
- Dialog/Modal bileşeni
- Select ve Textarea UI bileşenleri
- Oluşturma/Düzenleme formları
- Detay sayfaları
- Silme işlevselliği

## Uygulama Planı

### 1. UI Bileşenleri Oluşturma

#### 1.1 Dialog Component
- **Dosya**: `src/components/ui/dialog.tsx`
- Radix UI Dialog kullanarak modal pencere
- Formlar için kullanılacak

#### 1.2 Select Component
- **Dosya**: `src/components/ui/select.tsx`
- Radix UI Select kullanarak dropdown
- Organizasyon seçimi, durum seçimi için kullanılacak

#### 1.3 Textarea Component
- **Dosya**: `src/components/ui/textarea.tsx`
- Açıklama alanları için

#### 1.4 Form Label Component
- **Dosya**: `src/components/ui/form.tsx`
- React Hook Form entegrasyonu için

### 2. Validasyon Şemaları

#### 2.1 Venue Schema
- **Dosya**: `src/lib/validations/venue.schema.ts`
```typescript
- name: required, min 2 karakter
- organization_id: required
- address: required
- city: required
- country: required
- capacity: required, min 1
- latitude: optional
- longitude: optional
- description: optional
```

#### 2.2 Organization Schema
- **Dosya**: `src/lib/validations/organization.schema.ts`
```typescript
- name: required, min 2 karakter
- description: optional
- address: optional
- phone: optional
- email: optional, email format
- website: optional, url format
- city: optional
- country: optional
```

### 3. Form Bileşenleri

#### 3.1 Venue Form Component
- **Dosya**: `src/components/venues/venue-form.tsx`
- Hem oluşturma hem düzenleme için kullanılacak
- React Hook Form + Zod validasyon
- Alanlar:
  - Organizasyon seçimi (dropdown)
  - Mekan adı
  - Adres
  - Şehir
  - Ülke
  - Kapasite
  - Enlem/Boylam (opsiyonel)
  - Açıklama (textarea)

#### 3.2 Organization Form Component
- **Dosya**: `src/components/organizations/organization-form.tsx`
- Hem oluşturma hem düzenleme için kullanılacak
- React Hook Form + Zod validasyon
- Alanlar:
  - Organizasyon adı
  - Açıklama
  - Adres
  - Telefon
  - E-posta
  - Website
  - Şehir
  - Ülke

### 4. Sayfa Güncellemeleri

#### 4.1 Venues Page Güncellemesi
- **Dosya**: `src/app/(dashboard)/venues/page.tsx`
- "Yeni Mekan" butonu → Dialog aç
- Düzenle butonu → Dialog aç (verilerle dolu)
- Sil butonu → Onay dialogu + API çağrısı
- Başarı/hata mesajları (toast)

#### 4.2 Organizations Page Güncellemesi
- **Dosya**: `src/app/(dashboard)/organizations/page.tsx`
- "Yeni Organizasyon" butonu → Dialog aç
- Düzenle butonu → Dialog aç (verilerle dolu)
- Sil butonu → Onay dialogu + API çağrısı
- Başarı/hata mesajları (toast)

### 5. Detay Sayfaları

#### 5.1 Venue Detail Page
- **Dosya**: `src/app/(dashboard)/venues/[id]/page.tsx`
- Mekan bilgileri detaylı görüntüleme
- İlişkili organizasyon bilgisi
- İlişkili etkinlikler listesi
- Düzenleme butonu

#### 5.2 Organization Detail Page
- **Dosya**: `src/app/(dashboard)/organizations/[id]/page.tsx`
- Organizasyon bilgileri detaylı görüntüleme
- İlişkili mekanlar listesi
- İstatistikler (etkinlik sayısı, toplam gelir vb.)
- Düzenleme butonu

## Teknik Detaylar

### Kullanılan Teknolojiler
- **Form Yönetimi**: React Hook Form v7.71.2
- **Validasyon**: Zod v4.3.6
- **UI Bileşenleri**: Radix UI (@radix-ui/react-dialog, @radix-ui/react-select)
- **Stil**: Tailwind CSS v4
- **İkonlar**: Lucide React v0.577.0

### API Entegrasyonu
Mevcut servisler kullanılacak:
- `venuesService.getAll()` - Listeleme
- `venuesService.getById(id)` - Detay getirme
- `venuesService.create(data)` - Oluşturma
- `venuesService.update(id, data)` - Güncelleme
- `venuesService.delete(id)` - Silme
- `organizationsService.getAll()` - Listeleme
- `organizationsService.getById(id)` - Detay getirme
- `organizationsService.create(data)` - Oluşturma
- `organizationsService.update(id, data)` - Güncelleme
- `organizationsService.delete(id)` - Silme

### Tip Tanımları
Mevcut tipler kullanılacak:
- `Venue`, `CreateVenueRequest`, `UpdateVenueRequest`
- `Organization`, `CreateOrganizationRequest`, `UpdateOrganizationRequest`

## Dosya Yapısı

```
src/
├── app/(dashboard)/
│   ├── venues/
│   │   ├── page.tsx (güncellenecek)
│   │   └── [id]/
│   │       └── page.tsx (yeni)
│   └── organizations/
│       ├── page.tsx (güncellenecek)
│       └── [id]/
│           └── page.tsx (yeni)
├── components/
│   ├── ui/
│   │   ├── dialog.tsx (yeni)
│   │   ├── select.tsx (yeni)
│   │   ├── textarea.tsx (yeni)
│   │   └── form.tsx (yeni)
│   ├── venues/
│   │   └── venue-form.tsx (yeni)
│   └── organizations/
│       └── organization-form.tsx (yeni)
└── lib/
    └── validations/
        ├── venue.schema.ts (yeni)
        └── organization.schema.ts (yeni)
```

## Kullanıcı Akışları

### Yeni Mekan Ekleme
1. Kullanıcı "Yeni Mekan" butonuna tıklar
2. Modal dialog açılır
3. Form alanlarını doldurur
4. Validasyon kontrolü
5. "Kaydet" butonuna tıklar
6. API çağrısı yapılır
7. Başarılı ise: Liste güncellenir, toast mesajı gösterilir, modal kapanır
8. Hatalı ise: Hata mesajı gösterilir

### Mekan Düzenleme
1. Kullanıcı bir mekanın "Düzenle" butonuna tıklar
2. Modal dialog açılır, mevcut verilerle dolu
3. Kullanıcı değişiklikleri yapar
4. Validasyon kontrolü
5. "Güncelle" butonuna tıklar
6. API çağrısı yapılır
7. Başarılı ise: Liste güncellenir, toast mesajı gösterilir, modal kapanır
8. Hatalı ise: Hata mesajı gösterilir

### Mekan Silme
1. Kullanıcı bir mekanın "Sil" butonuna tıklar
2. Onay dialogu açılır
3. Kullanıcı onaylarsa API çağrısı yapılır
4. Başarılı ise: Listeden kaldırılır, toast mesajı gösterilir
5. Hatalı ise: Hata mesajı gösterilir

### Organizasyon İşlemleri
Yukarıdaki akışlar organizasyonlar için de aynı şekilde geçerlidir.

## Yetkilendirme

- **SUPER_ADMIN**: Tüm organizasyonları ve mekanları yönetebilir
- **ORG_ADMIN**: Sadece kendi organizasyonunu ve mekanlarını yönetebilir
- **CO_ADMIN**: Atandığı organizasyonları ve mekanları görüntüleyebilir, düzenleyemez

## Backend API Gereksinimleri

Aşağıdaki bölüm backend geliştirici için hazırlanmıştır.
