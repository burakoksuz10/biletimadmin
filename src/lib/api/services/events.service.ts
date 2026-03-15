// Events Service
// Handles all event-related API operations

import { apiClient } from "../client";
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  UpdateEventStatusRequest,
  EventFilters,
  EventStatus,
} from "../types/biletleme.types";

class EventsService {
  /**
   * Get all events
   * Results are filtered based on user's organization access
   */
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const response = await apiClient.get<{ data: Event[] } | Event[]>(
      "/events",
      { params: filters }
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get event by ID
   */
  async getById(id: number): Promise<Event> {
    const response = await apiClient.get<{ data: Event } | Event>(
      `/events/${id}`
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Create new event
   */
  async create(data: CreateEventRequest): Promise<Event> {
    const response = await apiClient.post<{ data: Event } | Event>(
      "/events",
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Update event
   */
  async update(id: number, data: UpdateEventRequest): Promise<Event> {
    const response = await apiClient.put<{ data: Event } | Event>(
      `/events/${id}`,
      data
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Delete event
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  }

  /**
   * Update event status
   */
  async updateStatus(id: number, status: EventStatus): Promise<Event> {
    const response = await apiClient.patch<{ data: Event } | Event>(
      `/events/${id}/status`,
      { status }
    );

    // Handle different response formats
    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Get events by organization
   */
  async getByOrganization(organizationId: number): Promise<Event[]> {
    return this.getAll({ organization_id: organizationId });
  }

  /**
   * Get events by venue
   */
  async getByVenue(venueId: number): Promise<Event[]> {
    return this.getAll({ venue_id: venueId });
  }

  /**
   * Get events by category
   */
  async getByCategory(categoryId: number): Promise<Event[]> {
    return this.getAll({ category_id: categoryId });
  }

  /**
   * Get upcoming events
   */
  async getUpcoming(): Promise<Event[]> {
    const response = await apiClient.get<{ data: Event[] } | Event[]>(
      "/events/upcoming"
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get featured events
   */
  async getFeatured(): Promise<Event[]> {
    const response = await apiClient.get<{ data: Event[] } | Event[]>(
      "/events/featured"
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }
}

// Export singleton instance
export const eventsService = new EventsService();
