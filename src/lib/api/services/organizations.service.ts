// Organizations Service
// Handles all organization-related API operations

import { apiClient } from "../client";
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationFilters,
} from "../types/biletleme.types";

// Response types for API
interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface OrganizationsListResponse {
  data: Organization[];
  pagination?: PaginationMeta;
}

class OrganizationsService {
  /**
   * Get all organizations
   * For SUPER_ADMIN: returns all organizations
   * For ORG_ADMIN: returns only their organization
   * For CO_ADMIN: returns their assigned organizations
   */
  async getAll(filters?: OrganizationFilters): Promise<OrganizationsListResponse> {
    try {
      const response = await apiClient.get<any>("/organizations", {
        params: filters
      });

      // Backend API format: { success: true, message: "...", data: [...], pagination: {...} }
      if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          pagination: response.pagination || {
            total: response.data.length,
            per_page: response.data.length,
            current_page: 1,
            last_page: 1,
            from: 1,
            to: response.data.length
          }
        };
      }

      // If response is directly an array (fallback)
      if (Array.isArray(response)) {
        return {
          data: response,
          pagination: {
            total: response.length,
            per_page: response.length,
            current_page: 1,
            last_page: 1,
            from: 1,
            to: response.length
          }
        };
      }

      // Empty fallback
      return {
        data: [],
        pagination: {
          total: 0,
          per_page: 0,
          current_page: 1,
          last_page: 1,
          from: 0,
          to: 0
        }
      };
    } catch (error) {
      console.error("❌ [ORGANIZATIONS SERVICE] API çağrısı hatası:", error);
      throw error;
    }
  }

  /**
   * Get organization by ID
   */
  async getById(id: number): Promise<Organization> {
    const response = await apiClient.get<any>(`/organizations/${id}`);

    // Backend API format: { success: true, data: { ...organization } }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the organization
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the organization (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Organizatör bulunamadı");
  }

  /**
   * Create new organization (SUPER_ADMIN only)
   * Supports both JSON and FormData (with file upload)
   */
  async create(data: CreateOrganizationRequest | FormData): Promise<Organization> {
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } as any : undefined;

    const response = await apiClient.post<any>("/organizations", data, config);

    // Backend API format: { success: true, data: { ...organization }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the organization
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the organization (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Organizatör oluşturulamadı");
  }

  /**
   * Update organization
   * Supports both JSON and FormData (with file upload)
   */
  async update(id: number, data: UpdateOrganizationRequest | FormData): Promise<Organization> {
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } as any : undefined;

    const response = await apiClient.post<any>(`/organizations/${id}`, data, config);

    // Backend API format: { success: true, data: { ...organization }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the organization
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the organization (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Organizatör güncellenemedi");
  }

  /**
   * Delete organization (SUPER_ADMIN only)
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<any>(`/organizations/${id}`);
    
    // Backend API format: { success: true, message: "..." }
    return {
      success: response.data?.success ?? true,
      message: response.data?.message ?? "Organizatör başarıyla silindi"
    };
  }

  /**
   * Get organization statistics
   */
  async getStats(id: number): Promise<{
    total_events: number;
    active_events: number;
    total_venues: number;
    total_orders: number;
    total_revenue: number;
  }> {
    const response = await apiClient.get<any>(`/organizations/${id}/stats`);

    // Backend API format: { success: true, data: { ...stats } }
    if (response.data && response.data.data) {
      return response.data.data;
    }

    // If response.data is directly the stats
    if (response.data && typeof response.data.total_events === 'number') {
      return response.data;
    }

    // Default fallback
    return {
      total_events: 0,
      active_events: 0,
      total_venues: 0,
      total_orders: 0,
      total_revenue: 0
    };
  }
}

// Export singleton instance
export const organizationsService = new OrganizationsService();
