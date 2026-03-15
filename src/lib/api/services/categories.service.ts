// Event Categories Service
// Handles all event category-related API operations

import { apiClient } from "../client";
import type { EventCategory } from "../types/biletleme.types";

class CategoriesService {
  /**
   * Get all event categories
   */
  async getAll(): Promise<EventCategory[]> {
    const response = await apiClient.get<{ data: EventCategory[] } | EventCategory[]>(
      "/event-categories"
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get active event categories
   */
  async getActive(): Promise<EventCategory[]> {
    const response = await apiClient.get<{ data: EventCategory[] } | EventCategory[]>(
      "/event-categories/active"
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<EventCategory> {
    const response = await apiClient.get<{ data: EventCategory } | EventCategory>(
      `/event-categories/${id}`
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as EventCategory;
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<EventCategory> {
    const response = await apiClient.get<{ data: EventCategory } | EventCategory>(
      `/event-categories/slug/${slug}`
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as EventCategory;
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();
