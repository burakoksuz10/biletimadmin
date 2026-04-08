// Stages Service
// Handles all stage (salon) related API operations

import { apiClient } from "../client";
import type { SeatingType } from "../types/biletleme.types";

// API Stage types (raw backend response)
export interface ApiStage {
  id: number;
  venue_id: number;
  name: string;
  capacity: number;
  seating_type: SeatingType;
  gate_info?: string | null;
  stage_image?: string | null;
  seating_plan?: unknown;
  seats_count?: number;
  venue?: {
    id: number;
    name: string;
    city: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStageRequest {
  name: string;
  capacity: number;
  seating_type: SeatingType;
  gate_info?: string | null;
}

export interface UpdateStageRequest extends Partial<CreateStageRequest> {}

class StagesService {
  /**
   * Get stages by venue
   */
  async getByVenue(venueId: number): Promise<ApiStage[]> {
    const response = await apiClient.get<any>(`/venues/${venueId}/stages`);

    // Backend API format: { success: true, data: [...stages] }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data.data is an array
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  }

  /**
   * Get stage by ID
   * Route: GET /api/v1/venues/{venue}/stages/{stage}
   */
  async getById(venueId: number, stageId: number): Promise<ApiStage> {
    const response = await apiClient.get<any>(`/venues/${venueId}/stages/${stageId}`);

    if (response.data?.data?.id) {
      return response.data.data;
    }

    if (response.data?.id) {
      return response.data;
    }

    throw new Error("Salon bulunamadı");
  }

  /**
   * Create new stage for a venue
   */
  async create(venueId: number, data: CreateStageRequest): Promise<ApiStage> {
    try {
      const responseData = await apiClient.post<any>(`/venues/${venueId}/stages`, data);

      // Backend API format: { success: true, data: { ...stage } }
      if (responseData?.data?.id) {
        return responseData.data;
      }

      // If response is directly the stage
      if (responseData?.id) {
        return responseData;
      }

      throw new Error("Salon oluşturulamadı - Geçersiz yanıt");
    } catch (error: any) {
      console.error("[StagesService] Create error:", error?.message || error);
      throw error;
    }
  }

  /**
   * Update stage - uses PUT as per API documentation
   * Route: PUT /api/v1/venues/{venue}/stages/{stage}
   */
  async update(venueId: number, stageId: number, data: UpdateStageRequest): Promise<ApiStage> {
    try {
      const responseData = await apiClient.put<any>(`/venues/${venueId}/stages/${stageId}`, data);

      if (responseData?.data?.id) {
        return responseData.data;
      }

      if (responseData?.id) {
        return responseData;
      }

      throw new Error("Salon güncellenemedi - Geçersiz yanıt");
    } catch (error: any) {
      console.error("[StagesService] Update error:", error?.message || error);
      throw error;
    }
  }

  /**
   * Delete stage
   * Route: DELETE /api/v1/venues/{venue}/stages/{stage}
   */
  async delete(venueId: number, stageId: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<any>(`/venues/${venueId}/stages/${stageId}`);

    return {
      success: response.data?.success ?? true,
      message: response.data?.message ?? "Salon başarıyla silindi",
    };
  }

  /**
   * Get all seats for a stage
   * Route: GET /api/v1/stages/{stage}/seats
   */
  async getSeats(stageId: number): Promise<any[]> {
    try {
      const response = await apiClient.get<any>(`/stages/${stageId}/seats`);
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Delete a single seat
   * Route: DELETE /api/v1/stages/{stage}/seats/{seat}
   */
  async deleteSeat(stageId: number, seatId: number): Promise<void> {
    await apiClient.delete(`/stages/${stageId}/seats/${seatId}`);
  }

  /**
   * Delete all seats for a stage
   */
  async deleteAllSeats(stageId: number): Promise<void> {
    const seats = await this.getSeats(stageId);
    for (const seat of seats) {
      await this.deleteSeat(stageId, seat.id);
    }
  }

  /**
   * Bulk create seats for a stage
   * Route: POST /api/v1/stages/{stage}/seats/bulk
   *
   * Payload format (single range):
   * {
   *   "row_label": "A",
   *   "seat_type_id": 1,
   *   "start_number": 1,
   *   "end_number": 15
   * }
   */
  async createBulkSeats(venueId: number, stageId: number, data: {
    row_label: string;
    seat_type_id: number;
    start_number: number;
    end_number: number;
  }): Promise<any> {
    console.log("[StagesService] Creating bulk seats:", { venueId, stageId, data });

    const url = `/stages/${stageId}/seats/bulk`;
    console.log("[StagesService] URL:", url);

    const response = await apiClient.post<any>(url, data);
    console.log("[StagesService] Response:", response);
    return response.data;
  }
}

// Export singleton instance
export const stagesService = new StagesService();
