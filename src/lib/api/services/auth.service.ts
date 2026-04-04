// Authentication Service
// Handles all authentication operations with Laravel Sanctum Token-based Auth

import { apiClient } from "../client";
import type { BackendUser } from "../types/biletleme.types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    token: string;
    token_type: string;
  };
}

class AuthService {
  /**
   * Login with email and password
   * Returns user data and stores the Bearer token
   */
  async login(credentials: LoginCredentials): Promise<BackendUser> {
    console.log("🔑 [AUTH SERVICE] Login başlıyor:", credentials.email);

    // First, fetch CSRF token for cookie-based auth
    console.log("🔐 [AUTH SERVICE] CSRF token alınıyor...");
    await apiClient.fetchCsrfToken();

    // Login to /api/v1/login endpoint
    const response = await apiClient.post<LoginResponse>(
      "/login",
      credentials
    );

    console.log("📦 [AUTH SERVICE] Backend yanıtı:", response);

    // Store the Bearer token (if returned by backend)
    if (response.success && response.data?.token) {
      console.log("💾 [AUTH SERVICE] Token saklanıyor:", response.data.token.substring(0, 20) + "...");
      apiClient.setToken(response.data.token);
    } else {
      console.log("ℹ️ [AUTH SERVICE] Token cookie-based auth kullanılıyor");
    }

    // Return the user data
    console.log("✅ [AUTH SERVICE] User data dönüyor:", response.data.user);
    return response.data.user;
  }

  /**
   * Register new user
   * Returns user data and stores the Bearer token
   */
  async register(data: RegisterData): Promise<BackendUser> {
    // First, fetch CSRF token for cookie-based auth
    await apiClient.fetchCsrfToken();

    // Register to /api/v1/register endpoint
    const response = await apiClient.post<LoginResponse>(
      "/register",
      data
    );

    // Store the Bearer token (if returned by backend)
    if (response.success && response.data?.token) {
      apiClient.setToken(response.data.token);
    }

    // Return the user data
    return response.data.user;
  }

  /**
   * Logout current user
   * Clears token from storage and calls backend logout endpoint
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/logout");
    } catch {
      // Even if logout fails on server, we clear local state
      console.warn("Sunucu logout hatası, yerel oturum temizleniyor");
    } finally {
      // Always clear the token
      apiClient.clearToken();
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<BackendUser> {
    const response = await apiClient.get<{ data: BackendUser } | BackendUser>(
      "/auth/me"
    );

    // Handle response format { data: { user } }
    if ("data" in response && response.data) {
      return response.data;
    }

    // Handle direct user object response
    return response as unknown as BackendUser;
  }

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/forgot-password", { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await apiClient.post("/reset-password", data);
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(data: { email: string; otp: string }): Promise<void> {
    await apiClient.post("/verify-otp", data);
  }

  /**
   * Check if user has a valid token
   */
  hasValidToken(): boolean {
    return apiClient.hasValidToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
