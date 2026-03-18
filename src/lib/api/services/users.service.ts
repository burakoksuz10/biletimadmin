// Users Service
// Handles all user-related API operations (admin users, not customers)

import { apiClient } from "../client";
import type { BackendUser } from "../types/biletleme.types";

interface UsersListResponse {
  data: BackendUser[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

class UsersService {
  /**
   * Get all admin users (excluding customers)
   * Uses /users?exclude_roles[]=customer endpoint
   */
  async getAdminUsers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<UsersListResponse> {
    try {
      const response = await apiClient.get<any>("/users", {
        params: {
          ...params,
          exclude_roles: ["customer"]
        }
      });

      // Backend API formatı: { success: true, data: { users: [...], pagination: {...} } }
      if (response.data && response.data.data && response.data.data.users && Array.isArray(response.data.data.users)) {
        const pagination = response.data.data.pagination;
        return {
          data: response.data.data.users,
          meta: {
            current_page: pagination?.current_page || 1,
            per_page: pagination?.per_page || response.data.data.users.length,
            total: pagination?.total || response.data.data.users.length,
            last_page: pagination?.total_pages || 1
          }
        };
      }

      // Eski format için fallback: { success: true, data: [...], pagination: {...} }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const pagination = response.data.pagination;
        return {
          data: response.data.data,
          meta: {
            current_page: pagination?.current_page || 1,
            per_page: pagination?.per_page || response.data.data.length,
            total: pagination?.total || response.data.data.length,
            last_page: pagination?.last_page || 1
          }
        };
      }

      // Eğer yanıt doğrudan bir array ise (fallback)
      if (Array.isArray(response)) {
        return {
          data: response,
          meta: {
            current_page: 1,
            per_page: response.length,
            total: response.length,
            last_page: 1
          }
        };
      }

      // Eğer yanıt response.data içinde array ise (fallback)
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          meta: {
            current_page: 1,
            per_page: response.data.length,
            total: response.data.length,
            last_page: 1
          }
        };
      }

      // Hiçbir durum uymazsa boş array dön
      return {
        data: [],
        meta: {
          current_page: 1,
          per_page: 0,
          total: 0,
          last_page: 1
        }
      };
    } catch (error: any) {
      console.error("❌ [USERS SERVICE] API çağrısı hatası:", error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * Uses /users/{id} endpoint
   */
  async getById(id: number): Promise<BackendUser> {
    const response = await apiClient.get<any>(`/users/${id}`);

    // Backend API formatı: { success: true, data: { ...user } }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // Eğer yanıt data içinde ise (fallback)
    if (response.data && response.data.id) {
      return response.data;
    }

    // Eğer yanıt doğrudan user nesnesi ise (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Kullanıcı bulunamadı");
  }

  /**
   * Update user
   * Uses /users/{id} endpoint
   */
  async update(id: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    status?: "active" | "suspended" | "banned";
  }): Promise<BackendUser> {
    const response = await apiClient.put<any>(`/users/${id}`, data);

    // Backend API formatı: { success: true, data: { ...user }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // Eğer yanıt data içinde ise (fallback)
    if (response.data && response.data.id) {
      return response.data;
    }

    // Eğer yanıt doğrudan user nesnesi ise (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Kullanıcı güncellenemedi");
  }

  /**
   * Delete user (soft delete)
   * Uses /users/{id} endpoint
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  /**
   * Bulk action on users
   * Uses /users/bulk-action endpoint
   */
  async bulkAction(
    action: "suspend" | "activate" | "ban",
    userIds: number[],
    data?: any
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/users/bulk-action", {
      action,
      user_ids: userIds,
      data,
    });

    return response;
  }

  /**
   * Get users by role
   * Uses /users/by-role/{role} endpoint
   */
  async getByRole(role: string): Promise<BackendUser[]> {
    try {
      const response = await apiClient.get<any>(`/users/by-role/${role}`);

      // Backend API format: { success: true, data: [...] }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // If response is directly an array
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error(`❌ [USERS SERVICE] getByRole(${role}) hatası:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * Uses POST /users endpoint
   */
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<BackendUser> {
    const response = await apiClient.post<any>("/users", data);

    // Backend API format: { success: true, data: { ...user }, message: "..." }
    if (response.data && response.data.id) {
      return response.data;
    }

    if (response.id) {
      return response;
    }

    throw new Error("Kullanıcı oluşturulamadı");
  }
}

// Export singleton instance
export const usersService = new UsersService();
