// API Client Configuration with Axios
// Configured for Laravel Sanctum Cookie-based (Stateful) Authentication
// Backend: Biletleme Platform (Laravel 12)

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://biletim.simgesoft.com";
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || "v1";

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
  private csrfClient: AxiosInstance;

  constructor() {
    // Main API client - for all API requests
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      timeout: 30000,
      withCredentials: true, // Required for Sanctum cookie-based auth
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    // Separate client for CSRF cookie (no /api/v1 prefix)
    this.csrfClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
    });

    // Request interceptor - Add XSRF token from cookie
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Axios automatically reads XSRF-TOKEN cookie and sets X-XSRF-TOKEN header
        // when withCredentials is true. No manual handling needed.
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

        // Handle 401 - Unauthorized (session expired)
        if (status === 401) {
          if (typeof window !== "undefined") {
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

  // Fetch CSRF cookie from Laravel Sanctum
  // Must be called before login/register
  async getCsrfToken(): Promise<void> {
    await this.csrfClient.get("/sanctum/csrf-cookie");
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
