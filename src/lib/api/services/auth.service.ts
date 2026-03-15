// Authentication Service
// Handles all authentication operations with Laravel Sanctum

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

interface AuthResponse {
  data: BackendUser;
  message?: string;
}

class AuthService {
  /**
   * Fetch CSRF cookie from Laravel Sanctum
   * Must be called before login/register for web authentication
   */
  async getCsrfToken(): Promise<void> {
    await apiClient.getCsrfToken();
  }

  /**
   * Login with email and password
   * Automatically fetches CSRF token before login
   */
  async login(credentials: LoginCredentials): Promise<BackendUser> {
    // First, get CSRF token
    await this.getCsrfToken();

    // Then, login - backend returns { data: { user object } } or { user: {...} }
    // We handle both formats
    const response = await apiClient.post<AuthResponse | BackendUser>(
      "/auth/login",
      credentials
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data as BackendUser;
    }

    return response as BackendUser;
  }

  /**
   * Register new user
   * Automatically fetches CSRF token before registration
   */
  async register(data: RegisterData): Promise<BackendUser> {
    // First, get CSRF token
    await this.getCsrfToken();

    // Then, register
    const response = await apiClient.post<AuthResponse | BackendUser>(
      "/auth/register",
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data as BackendUser;
    }

    return response as BackendUser;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Even if logout fails on server, we clear local state
      console.warn("Sunucu logout hatası, yerel oturum temizleniyor");
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<BackendUser> {
    const response = await apiClient.get<{ data: BackendUser } | BackendUser>(
      "/auth/me"
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data as BackendUser;
    }

    return response as BackendUser;
  }

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    await this.getCsrfToken();
    await apiClient.post("/auth/forgot-password", { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await this.getCsrfToken();
    await apiClient.post("/auth/reset-password", data);
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(data: { email: string; otp: string }): Promise<void> {
    await this.getCsrfToken();
    await apiClient.post("/auth/verify-otp", data);
  }
}

// Export singleton instance
export const authService = new AuthService();
