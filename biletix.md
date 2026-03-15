# API Integration & Authentication Guide (v1.0)

Bu döküman, **Biletleme Platformu Backend (Laravel 12)** API'sine bağlanacak olan **React (Web)** ve **Flutter (Mobile)** uygulamaları için teknik entegrasyon standartlarını belirler.

## 1. Mimari Genel Bakış
API, hibrit bir kimlik doğrulama yapısı kullanır. Backend, isteğin kaynağına göre (Stateful veya Stateless) otomatik karar verir.

- **Web (React):** Güvenlik (XSS/CSRF) protokolleri gereği **Cookie-based (Stateful)** Authentication.
- **Mobile (Flutter):** Standart **Bearer Token (Stateless)** Authentication.

---

## 2. Web Sitesi Entegrasyonu (React / SPA)

React uygulaması, Laravel Sanctum'un tarayıcı özelliklerini kullanmalıdır.

### A. İlk El Sıkışma (Handshake)
Herhangi bir login isteği atmadan önce, CSRF korumasını başlatmak için şu endpoint'e bir `GET` isteği atılmalıdır:
- **Endpoint:** `GET /sanctum/csrf-cookie`
- **İşlem:** Bu istek tarayıcıya `XSRF-TOKEN` çerezini set eder.

### B. Login Akışı
- **Endpoint:** `POST /v1/auth/login`
- **Body:** `{ "email": "...", "password": "..." }`
- **Önemli:** API isteklerinde `withCredentials: true` (Axios/Fetch) ayarı zorunludur. Başarılı girişte session çerezi set edilir.

### C. Sosyal Login
1. Kullanıcı tarayıcı üzerinden `/v1/auth/{provider}/redirect` adresine yönlendirilir.
2. Google/Facebook onayı sonrası backend oturumu açar ve kullanıcıyı frontend'e yönlendirir.

---

## 3. Mobil Uygulama Entegrasyonu (Flutter)

Mobil tarafta çerez yönetimi yerine `Personal Access Token` yönetimi esastır.

### A. Login Akışı
- **Endpoint:** `POST /v1/auth/login`
- **Body:** `{ "email": "...", "password": "...", "device_name": "iPhone_15_Pro" }`
- **Response:**
```json
{
    "token": "1|abc123token_verisi_burada",
    "user": { "id": 1, "name": "...", "role": "customer" }
}

Kullanım: Alınan token, sonraki tüm isteklerde Authorization: Bearer {token} header'ı ile gönderilmelidir.

B. Sosyal Login (Native SDK)
Flutter, Firebase veya Native Google SDK ile access_token alır.

Bu token backend'e iletilir: POST /v1/auth/social-login

Backend doğrular ve bir plainTextToken (Sanctum) döndürür.

4. Rota Yapısı ve Yetkilendirme
API rotaları üç ana grupta toplanmıştır:

Public API (v1/public/*): - Login gerektirmez. Etkinlik listeleri, salon yerleşim planları, boş koltuklar.

User API (v1/user/*): - Müşteri (Customer) yetkisi gerektirir. Bilet alma, geçmiş biletlerim, profil düzenleme.

Admin API (v1/admin/*): - İşletme Sahibi (Merchant) veya Staff yetkisi gerektirir. Salon yönetimi, raporlar, bilet check-in.

5. Standart Yanıt Formatı
Tüm API yanıtları tutarlılık adına bir data wrapper'ı içinde döner:

Başarılı Yanıt (Success):
{
    "data": {
        "id": 101,
        "name": "Harbiye Açık Hava Konseri",
        "date": "2026-05-20"
    }
}

Hata Yanıtı (Error):

{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["Bu e-posta adresi zaten kayıtlı."]
    }
}

6. Teknik Notlar
CORS: Frontend domainleri backend tarafında allowed_origins listesine eklenmiş olmalıdır.

Versioning: Tüm endpoint'ler v1 prefix'i ile başlar.

Encoding: Tüm veriler application/json formatında gönderilmeli ve alınmalıdır.