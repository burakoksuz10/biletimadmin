// Events Service
// Handles all event-related API operations
// Backend: Biletleme Platform (Laravel 12)

import { apiClient } from "../client";
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  EventStatus,
  PaginatedResponse,
  EventWithRelations,
} from "../types/biletleme.types";

class EventsService {
  // Use /events for admin panel (authenticated), /public/events for public
  private basePath = "/events";
  private publicPath = "/public/events";

  /**
   * Get all events (simple list)
   * Results are filtered based on user's organization access
   */
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const response = await apiClient.get<{ data: Event[] } | Event[]>(
      this.basePath,
      { params: filters }
    );

    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Get paginated events
   * Useful for table listings with pagination
   */
  async getPaginated(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    const response = await apiClient.get<PaginatedResponse<Event>>(
      this.basePath,
      { params: filters }
    );

    return response;
  }

  /**
   * Get event by ID with relations (organization, venue, category)
   */
  async getById(id: number): Promise<EventWithRelations> {
    const response = await apiClient.get<{ data: EventWithRelations } | EventWithRelations>(
      `${this.basePath}/${id}`
    );

    if ("data" in response && response.data) {
      return response.data;
    }

    return response as EventWithRelations;
  }

  /**
   * Create new event
   */
  async create(data: CreateEventRequest): Promise<Event> {
    const response = await apiClient.post<{ data: Event } | Event>(
      this.basePath,
      data
    );

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
      `${this.basePath}/${id}`,
      data
    );

    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Delete event
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  /**
   * Update event status
   */
  async updateStatus(id: number, status: EventStatus): Promise<Event> {
    const response = await apiClient.patch<{ data: Event } | Event>(
      `${this.basePath}/${id}/status`,
      { status }
    );

    if ("data" in response && response.data) {
      return response.data;
    }

    return response as Event;
  }

  /**
   * Publish event (set status to published)
   */
  async publish(id: number): Promise<Event> {
    return this.updateStatus(id, "published");
  }

  /**
   * Cancel event (set status to cancelled)
   */
  async cancel(id: number): Promise<Event> {
    return this.updateStatus(id, "cancelled");
  }

  /**
   * Set event as draft
   */
  async setDraft(id: number): Promise<Event> {
    return this.updateStatus(id, "draft");
  }

  /**
   * Get events by organization
   */
  async getByOrganization(organizationId: number, filters?: Omit<EventFilters, "organization_id">): Promise<Event[]> {
    return this.getAll({ ...filters, organization_id: organizationId });
  }

  /**
   * Get events by venue
   */
  async getByVenue(venueId: number, filters?: Omit<EventFilters, "venue_id">): Promise<Event[]> {
    return this.getAll({ ...filters, venue_id: venueId });
  }

  /**
   * Get events by category
   */
  async getByCategory(categoryId: number, filters?: Omit<EventFilters, "category_id">): Promise<Event[]> {
    return this.getAll({ ...filters, category_id: categoryId });
  }

  /**
   * Get upcoming events
   */
  async getUpcoming(filters?: Omit<EventFilters, "from_date">): Promise<Event[]> {
    const today = new Date().toISOString().split("T")[0];
    return this.getAll({ ...filters, from_date: today });
  }

  /**
   * Get featured events
   */
  async getFeatured(): Promise<Event[]> {
    const response = await apiClient.get<{ data: Event[] } | Event[]>(
      `${this.basePath}/featured`
    );

    if (Array.isArray(response)) {
      return response;
    }

    return response.data || [];
  }

  /**
   * Search events by title or description
   */
  async search(query: string, filters?: EventFilters): Promise<Event[]> {
    return this.getAll({ ...filters, search: query });
  }
}

// Export singleton instance
export const eventsService = new EventsService();
