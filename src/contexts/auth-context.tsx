"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType, LoginRequest, RegisterRequest } from "@/types/auth.types";
import type { BackendUser } from "@/lib/api/types/biletleme.types";
import { authService } from "@/lib/api/services";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to map BackendUser to User
function mapBackendUser(backendUser: BackendUser): User {
  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    role: backendUser.role,
    organization_id: backendUser.organization_id ?? undefined,
    organizations: backendUser.organizations,
    status: backendUser.status || "active", // Default to active if not provided
    avatar: backendUser.avatar,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.updated_at || backendUser.created_at, // Fallback to created_at
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage and verify token
  useEffect(() => {
    async function initAuth() {
      console.log("🚀 [AUTH CONTEXT] Initialization başlıyor...");
      try {
        const storedUser = localStorage.getItem("user");
        const hasToken = authService.hasValidToken();
        
        console.log("📦 [AUTH CONTEXT] localStorage'dan:", storedUser ? "User var" : "User yok");
        console.log("🔑 [AUTH CONTEXT] Token kontrolü:", hasToken ? "Token var" : "Token yok");

        if (storedUser && hasToken) {
          // First, load user from localStorage immediately
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ [AUTH CONTEXT] localStorage'dan user yüklendi:", parsedUser);
          setUser(parsedUser);
          
          // Then verify session is still valid by fetching current user from backend
          try {
            console.log("🔍 [AUTH CONTEXT] Backend'den user doğrulanıyor...");
            const backendUser = await authService.getCurrentUser();
            const mappedUser = mapBackendUser(backendUser);
            console.log("✅ [AUTH CONTEXT] Backend user doğrulandı:", mappedUser);
            setUser(mappedUser);
            localStorage.setItem("user", JSON.stringify(mappedUser));
          } catch (error) {
            console.error("❌ [AUTH CONTEXT] Backend doğrulaması başarısız:", error);
            // Token expired or invalid, clear storage
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          console.log("⚠️ [AUTH CONTEXT] Token veya user yok, login gerekli");
        }
      } catch (error) {
        console.error("❌ [AUTH CONTEXT] Initialization hatası:", error);
        // Error during initialization, clear storage
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        console.log("✅ [AUTH CONTEXT] Initialization tamamlandı, isLoading: false");
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log("🔐 [AUTH CONTEXT] Login fonksiyonu çağrıldı:", credentials.email);
    setIsLoading(true);
    try {
      // Real API call with CSRF token handling
      const backendUser = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

      console.log("✅ [AUTH CONTEXT] Backend user alındı:", backendUser);
      const mappedUser = mapBackendUser(backendUser);
      console.log("🔄 [AUTH CONTEXT] User mapped edildi:", mappedUser);
      
      setUser(mappedUser);
      console.log("💾 [AUTH CONTEXT] User state'e set edildi");
      
      localStorage.setItem("user", JSON.stringify(mappedUser));
      console.log("💾 [AUTH CONTEXT] User localStorage'a kaydedildi");
      
      // Verify token was stored
      const tokenCheck = localStorage.getItem("auth_token");
      console.log("🔑 [AUTH CONTEXT] Token kontrolü:", tokenCheck ? "✅ Var" : "❌ YOK");
    } catch (error) {
      console.error("❌ [AUTH CONTEXT] Login hatası:", error);
      // Re-throw error so it can be handled in the login page
      throw error;
    } finally {
      setIsLoading(false);
      console.log("✅ [AUTH CONTEXT] Login tamamlandı, isLoading: false");
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Real API call with CSRF token handling
      const backendUser = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        phone: data.phone,
      });

      const mappedUser = mapBackendUser(backendUser);
      setUser(mappedUser);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    } catch (error) {
      console.error("Register error in AuthContext:", error);
      // Re-throw error so it can be handled in the register page
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch {
      // Even if logout fails on server, we clear local state
      console.warn("Sunucu logout hatası, yerel oturum temizleniyor");
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const backendUser = await authService.getCurrentUser();
      const mappedUser = mapBackendUser(backendUser);
      setUser(mappedUser);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    } catch {
      // Failed to refresh user, clear session
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
