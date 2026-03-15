// Venues Service
// Handles all venue-related API operations

import { apiClient } from "../client";
import type {
  Venue,
  CreateVenueRequest,
  UpdateVenueRequest,
  VenueFilters,
} from "../types/biletleme.types";

class VenuesService {
  /**
   * Get all venues
   * Results are filtered based on user's organization access
   */
  async getAll(filters?: VenueFilters): Promise<Venue[]> {
    const response = await apiClient.get<{ data: Venue[] } | Venue[]>(
      "/venues",
      { params: filters }
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get venue by ID
   */
  async getById(id: number): Promise<Venue> {
    const response = await apiClient.get<{ data: Venue } | Venue>(
      `/venues/${id}`
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Venue;
  }

  /**
   * Create new venue
   */
  async create(data: CreateVenueRequest): Promise<Venue> {
    const response = await apiClient.post<{ data: Venue } | Venue>(
      "/venues",
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Venue;
  }

  /**
   * Update venue
   */
  async update(id: number, data: UpdateVenueRequest): Promise<Venue> {
    const response = await apiClient.put<{ data: Venue } | Venue>(
      `/venues/${id}`,
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Venue;
  }

  /**
   * Delete venue
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/venues/${id}`);
  }

  /**
   * Get venues by organization
   */
  async getByOrganization(organizationId: number): Promise<Venue[]> {
    return this.getAll({ organization_id: organizationId });
  }
}

// Export singleton instance
export const venuesService = new VenuesService();
