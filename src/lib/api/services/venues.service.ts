// Venues Service
// Handles all venue-related API operations

import { apiClient } from "../client";
import type {
  Venue,
  CreateVenueRequest,
  UpdateVenueRequest,
  VenueFilters,
} from "../types/biletleme.types";

// Response types for API
interface VenuesListResponse {
  data: Venue[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

class VenuesService {
  /**
   * Get all venues
   * Venues are independent from organizations (no organization_id filter)
   */
  async getAll(filters?: Omit<VenueFilters, 'organization_id'>): Promise<VenuesListResponse> {
    try {
      const response = await apiClient.get<any>("/venues", {
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
      console.error("❌ [VENUES SERVICE] API çağrısı hatası:", error);
      throw error;
    }
  }

  /**
   * Get venue by ID
   */
  async getById(id: number): Promise<Venue> {
    const response = await apiClient.get<any>(`/venues/${id}`);

    // Backend API format: { success: true, data: { ...venue } }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the venue
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the venue (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Mekan bulunamadı");
  }

  /**
   * Create new venue
   */
  async create(data: CreateVenueRequest): Promise<Venue> {
    const response = await apiClient.post<any>("/venues", data);

    // Backend API format: { success: true, data: { ...venue }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the venue
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the venue (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Mekan oluşturulamadı");
  }

  /**
   * Update venue
   */
  async update(id: number, data: UpdateVenueRequest): Promise<Venue> {
    const response = await apiClient.put<any>(`/venues/${id}`, data);

    // Backend API format: { success: true, data: { ...venue }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // If response.data is directly the venue
    if (response.data && response.data.id) {
      return response.data;
    }

    // If response is directly the venue (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Mekan güncellenemedi");
  }

  /**
   * Delete venue
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<any>(`/venues/${id}`);
    
    // Backend API format: { success: true, message: "..." }
    return {
      success: response.data?.success ?? true,
      message: response.data?.message ?? "Mekan başarıyla silindi"
    };
  }
}

// Export singleton instance
export const venuesService = new VenuesService();
