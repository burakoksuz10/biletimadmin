# CORS Ayarları - Backend Geliştiricisi İçin

## 📋 Frontend Bilgileri

- **Frontend URL:** `http://localhost:3000` (Development)
- **Production URL:** `https://biletim.vercel.app` ✅
- **Framework:** Next.js 15 (React)
- **Authentication:** Laravel Sanctum (Cookie-based/Stateful)

## 🔧 Gereken Backend Ayarları

### 1. CORS Yapılandırması (`config/cors.php`)

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_origins' => [
        'http://localhost:3000',
        'https://biletim.vercel.app', // Production
    ],
    
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    
    'allowed_headers' => ['Content-Type', 'Accept', 'X-XSRF-TOKEN', 'Authorization'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true, // ÖNEMLİ! Cookie gönderimi için
];
```

### 2. Sanctum Stateful Domains (`config/sanctum.php`)

```php
'stateful' => [
    'domains' => [
        'http://localhost:3000',
        'biletim.vercel.app', // Production (http:// olmadan)
    ],
],
```

### 3. Session Configuration (`config/session.php`)

```php
'domain' => env('SESSION_DOMAIN', null),

'secure' => env('SESSION_SECURE', false), // Development için false, production için true

'same_site' => 'lax',
```

### 4. Environment Variables (`.env`)

```env
# Development
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
SESSION_SECURE=false

# Production (şu an için gerek yok)
# SANCTUM_STATEFUL_DOMAINS=yourdomain.com
# SESSION_DOMAIN=yourdomain.com
# SESSION_SECURE=true
```

## 🧪 Test Etmek İçin

### 1. Login Testi

Frontend'de (https://biletim.vercel.app) şu bilgilerle giriş yapın:

| Email | Rol | Şifre |
|------|-----|-------|
| super@biletim.com | SUPER_ADMIN | password |
| bkm@biletim.com | BKM Org Admin | password |
| zorlu@biletim.com | Zorlu PSM Org Admin | password |
| anadolu@biletim.com | Anadolu Org Admin | password |
| ege@biletim.com | Ege Org Admin | password |
| coadmin@biletim.com | Co-Admin (BKM+Zorlu) | password |

### 2. API Testi

Tarayıcı konsolunda (F12) şu testi yapın:

```javascript
// 1. CSRF Token al
fetch('https://biletim.simgesoft.com/sanctum/csrf-cookie', {
  credentials: 'include'
}).then(() => console.log('CSRF OK'));

// 2. Login
fetch('https://biletim.simgesoft.com/api/v1/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: 'super@biletim.com',
    password: 'password'
  })
}).then(r => r.json()).then(d => console.log('Login:', d));
```

## ⚠️ Olası Hatalar

### CORS Hatası
```
Access to fetch at 'https://biletim.simgesoft.com/api/v1/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Çözüm:** `config/cors.php` dosyasında `supports_credentials => true` olduğundan emin olun.

### CSRF Hatası
```
419 Page Expired
```
**Çözüm:** Login'den önce `/sanctum/csrf-cookie` endpoint'ine GET isteği atın.

### Session Hatası
```
Session not found
```
**Çözüm:** `config/sanctum.php`'de `stateful` domains'e frontend URL'i ekleyin.

## 📞 İletişim

CORS ayarları yapıldıktan sonra test edebilirsiniz. Sorun yaşarsanız tarayıcı konsolundaki hata mesajını paylaşın.

---

**Not:** Bu ayarlar Laravel 12 + Sanctum için geçerlidir.
