// Custom React Hooks for Events
// Provides reusable data fetching and mutation logic for events

"use client";

import { useState, useEffect, useCallback } from "react";
import { eventsService } from "@/lib/api/services";
import { categoriesService } from "@/lib/api/services";
import type {
  Event,
  EventWithRelations,
  EventFilters,
  EventCategory,
  CreateEventRequest,
  UpdateEventRequest,
  EventStatus,
  PaginatedResponse,
} from "@/lib/api/types/biletleme.types";

// ============================================
// useEvents - Fetch list of events
// ============================================

interface UseEventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEvents(filters?: EventFilters): UseEventsState {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getAll(filters);
      setEvents(data);
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      setError(err?.message || "Etkinlikler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
}

// ============================================
// useEventsPaginated - Fetch paginated events
// ============================================

interface UseEventsPaginatedState {
  data: PaginatedResponse<Event> | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEventsPaginated(filters?: EventFilters): UseEventsPaginatedState {
  const [data, setData] = useState<PaginatedResponse<Event> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getPaginated(filters);
      setData(response);
    } catch (err: any) {
      console.error("Failed to fetch paginated events:", err);
      setError(err?.message || "Etkinlikler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    data,
    loading,
    error,
    refresh: fetchEvents,
  };
}

// ============================================
// useEvent - Fetch single event by ID
// ============================================

interface UseEventState {
  event: EventWithRelations | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEvent(id: number): UseEventState {
  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await eventsService.getById(id);
      setEvent(data);
    } catch (err: any) {
      console.error("Failed to fetch event:", err);
      setError(err?.message || "Etkinlik yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    error,
    refresh: fetchEvent,
  };
}

// ============================================
// useEventCategories - Fetch all categories
// ============================================

interface UseEventCategoriesState {
  categories: EventCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEventCategories(): UseEventCategoriesState {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err?.message || "Kategoriler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
}

// ============================================
// useEventMutations - Create, update, delete events
// ============================================

interface UseEventMutationsState {
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  createEvent: (data: CreateEventRequest) => Promise<Event | null>;
  updateEvent: (id: number, data: UpdateEventRequest) => Promise<Event | null>;
  deleteEvent: (id: number) => Promise<boolean>;
  updateStatus: (id: number, status: EventStatus) => Promise<Event | null>;
  publishEvent: (id: number) => Promise<Event | null>;
  cancelEvent: (id: number) => Promise<Event | null>;
}

export function useEventMutations(): UseEventMutationsState {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (data: CreateEventRequest): Promise<Event | null> => {
    try {
      setCreating(true);
      setError(null);
      const event = await eventsService.create(data);
      return event;
    } catch (err: any) {
      console.error("Failed to create event:", err);
      setError(err?.message || "Etkinlik oluşturulurken bir hata oluştu");
      return null;
    } finally {
      setCreating(false);
    }
  };

  const updateEvent = async (id: number, data: UpdateEventRequest): Promise<Event | null> => {
    try {
      setUpdating(true);
      setError(null);
      const event = await eventsService.update(id, data);
      return event;
    } catch (err: any) {
      console.error("Failed to update event:", err);
      setError(err?.message || "Etkinlik güncellenirken bir hata oluştu");
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const deleteEvent = async (id: number): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      await eventsService.delete(id);
      return true;
    } catch (err: any) {
      console.error("Failed to delete event:", err);
      setError(err?.message || "Etkinlik silinirken bir hata oluştu");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const updateStatus = async (id: number, status: EventStatus): Promise<Event | null> => {
    try {
      setUpdating(true);
      setError(null);
      const event = await eventsService.updateStatus(id, status);
      return event;
    } catch (err: any) {
      console.error("Failed to update event status:", err);
      setError(err?.message || "Etkinlik durumu güncellenirken bir hata oluştu");
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const publishEvent = async (id: number): Promise<Event | null> => {
    return updateStatus(id, "published");
  };

  const cancelEvent = async (id: number): Promise<Event | null> => {
    return updateStatus(id, "cancelled");
  };

  return {
    creating,
    updating,
    deleting,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    updateStatus,
    publishEvent,
    cancelEvent,
  };
}
