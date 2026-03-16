# ⚠️ CROSS-DOMAIN AUTHENTICATION SORUNU

## 🔴 Kritik Sorun

**Frontend Domain:** `biletim.vercel.app`  
**Backend Domain:** `biletim.simgesoft.com`  
**Backend SESSION_DOMAIN:** `.biletim.simgesoft.com`

### Problem Nedir?

Tarayıcılar, güvenlik nedeniyle farklı domainler arasında cookie paylaşımına izin vermez. Backend'in `SESSION_DOMAIN=.biletim.simgesoft.com` ile set ettiği cookie'ler **sadece** `*.simgesoft.com` subdomain'lerinde çalışır. 

`biletim.vercel.app` farklı bir domain olduğu için:
- ✅ CSRF token alınabilir
- ✅ Login request gönderilebilir  
- ❌ Ancak backend'in set ettiği session cookie frontend tarafından geri gönderilemez
- ❌ Sonraki API istekleri authentication hatası verir

## 🎯 Çözüm Seçenekleri

### Seçenek 1: Frontend'i Subdomain'e Taşı (ÖNERİLEN)

Frontend'i `biletim.simgesoft.com` subdomain'inde yayınlayın.

**Avantajları:**
- ✅ Cookie-based authentication çalışır
- ✅ Sanctum'ın stateful auth mekanizması tam çalışır
- ✅ En güvenli ve standard çözüm
- ✅ CSRF protection tam koruma sağlar

**Gerekli Değişiklikler:**

1. **Vercel'de Custom Domain Ekle:**
   - Vercel dashboard → Project Settings → Domains
   - `biletim.simgesoft.com` ekle
   - Vercel'in verdiği CNAME kaydını DNS'e ekle

2. **DNS Ayarları (simgesoft.com domain'inde):**
   ```
   Type: CNAME
   Name: biletim
   Value: cname.vercel-dns.com (Vercel'den alacaksınız)
   ```

3. **Backend .env - Değişiklik Gerekmez:**
   ```env
   SESSION_DOMAIN=.biletim.simgesoft.com  # Aynı kalabilir
   SANCTUM_STATEFUL_DOMAINS=biletim.simgesoft.com,localhost:3000
   ```

4. **Frontend .env.local:**
   ```env
   NEXT_PUBLIC_API_URL=https://biletim.simgesoft.com/api/v1
   ```

---

### Seçenek 2: Token-Based Authentication'a Geç

Cookie yerine API token kullanın (Sanctum'ın token auth modu).

**Avantajları:**
- ✅ Cross-domain çalışır
- ✅ Vercel'de kalabilir
- ✅ Mobile app'ler için de uygun

**Dezavantajları:**
- ⚠️ Token'ları localStorage'da saklamak CSRF riski taşır
- ⚠️ XSS saldırılarına karşı daha savunmasız
- ⚠️ Backend'de token authentication endpoint'leri eklenmeli

**Gerekli Backend Değişiklikleri:**

1. **Login endpoint'i token döndürmeli:**
   ```php
   // POST /api/v1/auth/login
   public function login(Request $request) {
       // ... validation ...
       
       $token = $user->createToken('admin-panel')->plainTextToken;
       
       return response()->json([
           'data' => $user,
           'token' => $token
       ]);
   }
   ```

2. **Sanctum middleware kullan:**
   ```php
   // routes/api.php
   Route::middleware('auth:sanctum')->group(function () {
       Route::get('/auth/me', [AuthController::class, 'me']);
       Route::post('/auth/logout', [AuthController::class, 'logout']);
       // ... other routes
   });
   ```

**Gerekli Frontend Değişiklikleri:**

1. **client.ts - Token interceptor ekle:**
   ```typescript
   // Request interceptor - Add Bearer token
   this.client.interceptors.request.use((config) => {
     const token = localStorage.getItem('auth_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

2. **auth.service.ts - Token kaydet:**
   ```typescript
   async login(credentials: LoginCredentials): Promise<BackendUser> {
     const response = await apiClient.post<{
       data: BackendUser;
       token: string;
     }>("/auth/login", credentials);
     
     // Save token
     localStorage.setItem('auth_token', response.token);
     
     return response.data;
   }
   ```

---

### Seçenek 3: Backend Proxy Ekle (Karmaşık, Önerilmez)

Vercel'de API route'ları oluşturup backend'e proxy yapın. Bu durumda frontend kendi domain'inden istek atar gibi görünür.

**Not:** Bu çözüm karmaşıktır ve her API endpoint için proxy oluşturulması gerekir. Önerilmez.

---

## 📊 Karşılaştırma

| Özellik | Subdomain (Seçenek 1) | Token Auth (Seçenek 2) |
|---------|------------------------|------------------------|
| Güvenlik | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| CSRF Koruması | ✅ Tam | ⚠️ Dikkat gerekir |
| XSS Koruması | ✅ İyi | ⚠️ Token çalınabilir |
| Kurulum Zorluğu | 🟡 Orta (DNS değişikliği) | 🟢 Kolay (Kod değişikliği) |
| Backend Değişiklik | 🟢 Minimal | 🟡 Orta (Token endpoint) |
| Frontend Değişiklik | 🟢 Minimal | 🟡 Orta (Token storage) |
| Mobile Uyumluluk | ⚠️ Web only | ✅ Uyumlu |
| Recommended | ✅ ÖNERİLEN | ⚠️ Alternatif |

---

## 🚀 Önerilen Aksiyon Planı

### Hemen Yapılabilir (Geçici - Test İçin)
Token-based auth'a geçilebilir çünkü sadece kod değişikliği gerekir ve hızlıca test edilebilir.

### Uzun Vadeli (Production İçin)
Frontend'i `biletim.simgesoft.com` subdomain'ine taşımak en güvenli ve professional çözümdür.

---

## 📞 İletişim

Bu dokümanda önerilen çözümlerden birini seçmek için backend developer ile görüşülmesi gerekiyor.

**Sorular:**
1. Vercel'de custom domain eklemek mümkün mü? (Seçenek 1)
2. DNS ayarlarını yapmak mümkün mü? (Seçenek 1)
3. Backend'de token authentication eklemek mümkün mü? (Seçenek 2)

**Not:** Her iki seçenek de çalışır durumdadır, sadece hangisinin projeniz için daha uygun olduğuna karar vermeniz gerekir.
