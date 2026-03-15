// Organizations Service
// Handles all organization-related API operations

import { apiClient } from "../client";
import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationFilters,
} from "../types/biletleme.types";

class OrganizationsService {
  /**
   * Get all organizations
   * For SUPER_ADMIN: returns all organizations
   * For ORG_ADMIN: returns only their organization
   * For CO_ADMIN: returns their assigned organizations
   */
  async getAll(filters?: OrganizationFilters): Promise<Organization[]> {
    const response = await apiClient.get<{ data: Organization[] } | Organization[]>(
      "/organizations",
      { params: filters }
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get organization by ID
   */
  async getById(id: number): Promise<Organization> {
    const response = await apiClient.get<{ data: Organization } | Organization>(
      `/organizations/${id}`
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Organization;
  }

  /**
   * Create new organization (SUPER_ADMIN only)
   */
  async create(data: CreateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.post<{ data: Organization } | Organization>(
      "/organizations",
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Organization;
  }

  /**
   * Update organization
   */
  async update(id: number, data: UpdateOrganizationRequest): Promise<Organization> {
    const response = await apiClient.put<{ data: Organization } | Organization>(
      `/organizations/${id}`,
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Organization;
  }

  /**
   * Delete organization (SUPER_ADMIN only)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/organizations/${id}`);
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
    const response = await apiClient.get<{
      data: {
        total_events: number;
        active_events: number;
        total_venues: number;
        total_orders: number;
        total_revenue: number;
      }
    }>(`/organizations/${id}/stats`);

    if ("data" in response && response.data) {
      return response.data;
    }

    return response as unknown as {
      total_events: number;
      active_events: number;
      total_venues: number;
      total_orders: number;
      total_revenue: number;
    };
  }
}

// Export singleton instance
export const organizationsService = new OrganizationsService();
