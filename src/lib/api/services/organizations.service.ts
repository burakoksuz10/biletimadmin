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
interface OrganizationsListResponse {
  data: Organization[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface OrganizationResponse {
  data: Organization;
  message?: string;
}

interface OrganizationStatsResponse {
  data: {
    total_events: number;
    active_events: number;
    total_venues: number;
    total_orders: number;
    total_revenue: number;
  };
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

      // Backend API format: { success: true, data: [...], meta: {...} }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return {
          data: response.data.data,
          meta: response.data.meta || {
            current_page: 1,
            per_page: response.data.data.length,
            total: response.data.data.length,
            last_page: 1
          }
        };
      }

      // If response.data is directly an array
      if (Array.isArray(response.data)) {
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

      // If response is directly an array (fallback)
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

      // Empty fallback
      return {
        data: [],
        meta: {
          current_page: 1,
          per_page: 0,
          total: 0,
          last_page: 1
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
   */
  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.post<any>("/organizations", data);

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
   */
  async update(id: number, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.put<any>(`/organizations/${id}`, data);

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
