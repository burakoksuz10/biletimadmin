# Veri Modeli İnceleme: Organization - Venue İlişkisi

## Mevcut Durum

Şu anki veri modelimizde şu ilişki yapısı var:

```
Organization (Organizasyon) → Venue (Mekan) → Event (Etkinlik)
```

**TypeScript Tanımı:**
```typescript
interface Venue {
  id: number;
  organization_id: number;  // ❌ Sorunlu alan
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  // ...
}

interface Event {
  id: number;
  organization_id: number;
  venue_id: number;
  title: string;
  // ...
}
```

## Problemler

### 1. Mekan Sahipliği vs Organizatörlük Karışıklığı

Gerçek dünyada:
- **BKM** bir etkinlik organizatörüdür (etkinlik düzenleyen şirket)
- **Harbiye Açık Hava Tiyatrosu** bir mekandır ve İBB'ye aittir
- BKM, Harbiye'yi kiralayarak etkinlik düzenler

Şu anki modelimizde:
- Harbiye'nin `organization_id = 1 (BKM)` olması, sanki Harbiye BKM'ye aitmiş gibi gösteriyor
- Oysa gerçekte BKM sadece orada etkinlik düzenliyor, mekan sahibi değil

### 2. Çok Organizatörlü Mekan Sorunu

Gerçek dünyada bir mekan birden fazla organizatör tarafından kullanılabilir:

**Örnek - Zorlu PSM:**
- ID İletişim: "Tarkan Konseri"
- BKM: "Sezen Aksu Konseri"
- Pozitif: "Rock Festivali"

Mevcut modelde Zorlu PSM sadece bir organizasyona bağlı olabilir.

## Sektör Analizi: Biletix, Passo, Biletinial

### Biletix Yapısı

Biletix'te etkinlik sayfasında şu bilgiler yer alır:

```
Etkinlik: "Sezen Aksu Konseri"
Organizatör: BKM
Mekan: Harbiye Açık Hava Tiyatrosu
Tarih: 15 Haziran 2024
```

**Veri Modeli:**
- Mekanlar bağımsız varlıklar
- Her etkinliğin bir organizatörü ve bir mekanı var
- Aynı mekan farklı organizatörler tarafından kullanılabilir

**Örnekler:**
```
Etkinlik 1: "Sezen Aksu Konseri"
  - Organizatör: BKM
  - Mekan: Harbiye Açık Hava Tiyatrosu

Etkinlik 2: "Mozart Gala"
  - Organizatör: İstanbul Devlet Opera ve Balesi
  - Mekan: Harbiye Açık Hava Tiyatrosu (Aynı mekan!)
```

### Passo Yapısı

Passo'da benzer yapı:

```
Etkinlik: "Tarkan Konseri"
Organizatör: ID İletişim
Mekan: Zorlu PSM Turkcell Platinum Sahne
```

**Veri Modeli:**
- Mekanlar organizatörlerden bağımsız
- İlişki etkinlik seviyesinde kurulur

**Örnekler:**
```
Etkinlik 1: "Tarkan Konseri"
  - Organizatör: ID İletişim
  - Mekan: Zorlu PSM

Etkinlik 2: "Sezen Aksu Konseri"
  - Organizatör: BKM
  - Mekan: Zorlu PSM (Aynı mekan!)

Etkinlik 3: "Rock Festivali"
  - Organizatör: Pozitif
  - Mekan: Zorlu PSM (Aynı mekan!)
```

### Biletinial Yapısı

Biletinial'da da aynı mantık:

```
Etkinlik: "Cem Yılmaz Stand-Up"
Organizatör: BKM
Mekan: Volkswagen Arena
```

**Veri Modeli:**
- Mekanlar bağımsız
- Organizatörler mekanlara sahip değil, sadece etkinlik düzenliyor

## Gerçek Dünya Örnekleri

### Örnek 1: Harbiye Açık Hava Tiyatrosu

```
Venue: "Harbiye Açık Hava Tiyatrosu"
  - id: 1
  - name: "Harbiye Açık Hava Tiyatrosu"
  - capacity: 7000
  - Gerçek sahibi: İBB

Event 1: "Sezen Aksu Konseri"
  - id: 1
  - organization_id: 1 (BKM)
  - venue_id: 1 (Harbiye)
  - date: 15.06.2024

Event 2: "Mozart Gala"
  - id: 2
  - organization_id: 5 (İstanbul Devlet Opera ve Balesi)
  - venue_id: 1 (Harbiye)  // Aynı mekan!
  - date: 20.06.2024

Event 3: "Cem Yılmaz Stand-Up"
  - id: 3
  - organization_id: 1 (BKM)
  - venue_id: 1 (Harbiye)  // Aynı mekan!
  - date: 25.06.2024
```

### Örnek 2: Zorlu PSM

```
Venue: "Zorlu PSM Turkcell Platinum Sahne"
  - id: 2
  - name: "Zorlu PSM Turkcell Platinum Sahne"
  - capacity: 2500

Event 1: "Tarkan Konseri"
  - organization_id: 3 (ID İletişim)
  - venue_id: 2 (Zorlu PSM)

Event 2: "Sezen Aksu Konseri"
  - organization_id: 1 (BKM)
  - venue_id: 2 (Zorlu PSM)  // Aynı mekan!

Event 3: "Rock Festivali"
  - organization_id: 4 (Pozitif)
  - venue_id: 2 (Zorlu PSM)  // Aynı mekan!

Event 4: "Jazz Night"
  - organization_id: 6 (İstanbul Caz Festivali)
  - venue_id: 2 (Zorlu PSM)  // Aynı mekan!
```

### Örnek 3: Volkswagen Arena

```
Venue: "Volkswagen Arena"
  - id: 3
  - name: "Volkswagen Arena"
  - capacity: 6000

Event 1: "Cem Yılmaz Stand-Up"
  - organization_id: 1 (BKM)
  - venue_id: 3 (VW Arena)

Event 2: "Konser"
  - organization_id: 7 (Live Nation)
  - venue_id: 3 (VW Arena)  // Aynı mekan!

Event 3: "Spor Gala"
  - organization_id: 8 (Spor Organizasyonu)
  - venue_id: 3 (VW Arena)  // Aynı mekan!
```

## Önerilen Çözüm: Event Odaklı İlişki

### Yeni Yapı

```
Organization (Organizatör)
  ↓ (many)
Event (Etkinlik)
  ↓ (one)
Venue (Mekan) - BAĞIMSIZ
```

### Yeni TypeScript Tanımları

```typescript
// Venue'den organization_id kaldırıldı
interface Venue {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  image?: string;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
  // organization_id YOK! ❌
}

// Event'te hem organizatör hem mekan var
interface Event {
  id: number;
  organization_id: number;  // ✅ Etkinliği organize eden
  venue_id: number;          // ✅ Etkinliğin yapılacağı mekan
  category_id: number;
  title: string;
  slug: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  // ...
}
```

## Avantajlar

✅ **Gerçek dünya mantığına uygun**: Bir mekan birden fazla organizatör tarafından kullanılabilir

✅ **Sektör standardı**: Biletix, Passo, Biletinial aynı yapıyı kullanır

✅ **Esnek yapı**: Yeni organizatörler mevcut mekanlarda etkinlik düzenleyebilir

✅ **Ölçeklenebilir**: Mekan sayısı az, etkinlik sayısı çok olabilir

✅ **Basit ve anlaşılır**: İlişki etkinlik seviyesinde net bir şekilde kurulur

## Migration Planı

### 1. Backend Değişiklikleri

```sql
-- venues tablosundan organization_id kaldır
ALTER TABLE venues DROP COLUMN organization_id;
```

### 2. Frontend Değişiklikleri

```typescript
// src/lib/api/types/biletleme.types.ts
interface Venue {
  // organization_id kaldırıldı
}

// src/components/venues/venue-form.tsx
// Organizasyon seçimi kaldırılacak
// Form sadece mekan bilgilerini içerecek
```

### 3. API Değişiklikleri

```typescript
// POST /venues - organization_id artık gerekli değil
interface CreateVenueRequest {
  // organization_id: number;  // ❌ Kaldır
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  // ...
}
```

## Karar

Bu değişikliği onaylıyor musunuz? Backend developer ile görüşüp kararlaştırabiliriz.
