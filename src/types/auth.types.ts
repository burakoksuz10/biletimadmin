// Authentication Types
// Updated for Biletleme Platform Backend

import type { BackendUser, BackendUserRole, Organization } from "@/lib/api/types/biletleme.types";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string; // Laravel expects this field name
  phone?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string; // Laravel expects this field name
}

// Backend auth response (cookie-based, no token in response for web)
export interface AuthResponse {
  user: BackendUser;
  message?: string;
}

// Frontend User type (mapped from BackendUser)
export interface User {
  id: number; // Backend uses number IDs
  name: string;
  email: string;
  phone?: string;
  role: BackendUserRole;
  organization_id?: number;
  organizations?: Organization[]; // For CO_ADMIN
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = BackendUserRole; // Use backend roles
export type UserStatus = "active" | "banned" | "suspended";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
