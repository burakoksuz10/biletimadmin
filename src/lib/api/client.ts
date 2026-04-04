// API Client Configuration with Axios
// Configured for Laravel Sanctum Cookie-based Authentication
// Backend: Biletleme Platform (Laravel 12)
//
// Local Development: Uses Next.js API proxy to avoid CORS/CSRF issues
// Production: Direct connection to backend

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://biletim.simgesoft.com";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

// Use Next.js API proxy in development to avoid CORS/CSRF issues
const USE_PROXY = process.env.NODE_ENV === "development";
const PROXY_BASE_URL = "/api";
const DIRECT_BASE_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Determine base URL
const getBaseURL = () => USE_PROXY ? PROXY_BASE_URL : DIRECT_BASE_URL;

// Token storage key (fallback/legacy)
const TOKEN_STORAGE_KEY = "auth_token";

// CSRF token state (only needed for direct connection)
let csrfToken: string | null = null;

// Error types
export interface ApiValidationError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = getBaseURL();

    console.log(`🔗 [API CLIENT] Using ${USE_PROXY ? "PROXY" : "DIRECT"} mode: ${baseURL}`);

    // Main API client - for all API requests
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: !USE_PROXY, // Only for direct connection
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // CSRF token configuration for Laravel Sanctum (only for direct connection)
      ...(USE_PROXY ? {} : {
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
      }),
    });

    // Request interceptor - Add Bearer token from localStorage
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token if available
        if (csrfToken) {
          config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const responseData = error.response?.data as Record<string, unknown> | undefined;

        // Handle 401 - Unauthorized (token expired or invalid)
        if (status === 401) {
          if (typeof window !== "undefined") {
            this.clearToken();
            localStorage.removeItem("user");
            // Only redirect if not already on login page
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }
          return Promise.reject({
            message: "Oturum süreniz doldu. Lütfen tekrar giriş yapın.",
            status: 401,
          } as ApiError);
        }

        // Handle 403 - Forbidden
        if (status === 403) {
          return Promise.reject({
            message: "Bu işlem için yetkiniz bulunmuyor.",
            status: 403,
          } as ApiError);
        }

        // Handle 404 - Not Found
        if (status === 404) {
          return Promise.reject({
            message: "İstenen kaynak bulunamadı.",
            status: 404,
          } as ApiError);
        }

        // Handle 422 - Validation Error
        if (status === 422) {
          const errors = responseData?.errors as Record<string, string[]> | undefined;
          const message = (responseData?.message as string) || "Girilen veriler geçersiz.";
          return Promise.reject({
            message,
            errors,
            status: 422,
          } as ApiValidationError);
        }

        // Handle 429 - Too Many Requests
        if (status === 429) {
          return Promise.reject({
            message: "Çok fazla istek gönderildi. Lütfen biraz bekleyin.",
            status: 429,
          } as ApiError);
        }

        // Handle 500+ - Server Error
        if (status && status >= 500) {
          return Promise.reject({
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
            status,
          } as ApiError);
        }

        // Handle network errors
        if (!error.response) {
          return Promise.reject({
            message: "Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.",
            status: 0,
          } as ApiError);
        }

        // Generic error
        const errorMessage =
          (responseData?.message as string) ||
          error.message ||
          "Bir hata oluştu";

        return Promise.reject({
          message: errorMessage,
          status,
          data: responseData,
        } as ApiError);
      }
    );
  }

  // Token management methods
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  hasValidToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Fetch CSRF token from Sanctum
   * Only needed for direct connection (production)
   * In development, proxy handles CSRF automatically
   */
  async fetchCsrfToken(): Promise<void> {
    if (USE_PROXY) {
      console.log("🔐 [API CLIENT] Proxy mode - CSRF handled by Next.js API route");
      return;
    }

    try {
      // Create a separate instance for CSRF fetching (no baseURL)
      const csrfClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        withCredentials: true,
        // CSRF token configuration for Laravel Sanctum
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
      });

      const response = await csrfClient.get("/sanctum/csrf-cookie");

      // Try to extract CSRF token from cookie
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        if (cookie.startsWith("XSRF-TOKEN=")) {
          csrfToken = cookie.split("=")[1];
          break;
        }
      }

      // Also try to get from response headers (some servers send it there)
      if (!csrfToken && response.headers["x-xsrf-token"]) {
        csrfToken = response.headers["x-xsrf-token"];
      }

      console.log("🔐 [API CLIENT] CSRF token fetched:", csrfToken?.substring(0, 20) + "...");
    } catch (error) {
      console.warn("⚠️ [API CLIENT] CSRF token fetch failed, continuing...", error);
      // Don't throw - let the request proceed
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: Partial<InternalAxiosRequestConfig>) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: Partial<InternalAxiosRequestConfig>) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: Partial<InternalAxiosRequestConfig>) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: Partial<InternalAxiosRequestConfig>) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: Partial<InternalAxiosRequestConfig>) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
