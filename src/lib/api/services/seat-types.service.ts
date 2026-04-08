// Seat Types Service
// Handles seat type related API operations

import { apiClient } from "../client";

export interface SeatType {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  sort_order?: number;
}

export interface CreateSeatTypeRequest {
  name: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

class SeatTypesService {
  /**
   * Get all seat types
   */
  async getAll(): Promise<SeatType[]> {
    const response = await apiClient.get<any>("/seat-types");

    // Backend API format: { success: true, data: [...types] }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];
  }

  /**
   * Get active seat types only
   */
  async getActive(): Promise<SeatType[]> {
    const types = await this.getAll();
    return types.filter((t) => t.is_active);
  }

  /**
   * Create a new seat type
   * Route: POST /api/v1/seat-types
   */
  async create(data: CreateSeatTypeRequest): Promise<SeatType> {
    const response = await apiClient.post<any>("/seat-types", data);

    if (response.data?.id) {
      return response.data;
    }

    if (response.data?.data?.id) {
      return response.data.data;
    }

    throw new Error("Koltuk tipi oluşturulamadı");
  }

  /**
   * Update a seat type
   * Route: PUT /api/v1/seat-types/{id}
   */
  async update(id: number, data: Partial<CreateSeatTypeRequest>): Promise<SeatType> {
    const response = await apiClient.put<any>(`/seat-types/${id}`, data);

    if (response.data?.id) {
      return response.data;
    }

    if (response.data?.data?.id) {
      return response.data.data;
    }

    throw new Error("Koltuk tipi güncellenemedi");
  }

  /**
   * Delete a seat type
   * Route: DELETE /api/v1/seat-types/{id}
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/seat-types/${id}`);
  }
}

// Export singleton instance
export const seatTypesService = new SeatTypesService();
