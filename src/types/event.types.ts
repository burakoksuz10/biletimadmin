// Event Types

export interface Event {
  id: string;
  name: string;
  description?: string;
  dateTime: string;
  location: string;
  venue?: string;
  category?: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: EventStatus;
  organizerId: string;
  organizerName: string;
  ticketTypes: TicketType[];
  coverImage?: string;
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = "published" | "pending" | "cancelled" | "draft" | "rejected";

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sold: number;
  available: number;
  eventId: string;
  salesStartDate?: string;
  salesEndDate?: string;
  minPurchase?: number;
  maxPurchase?: number;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  dateTime: string;
  location: string;
  venue?: string;
  category?: string;
  totalTickets: number;
  ticketTypes: Omit<TicketType, "id" | "eventId" | "sold" | "available">[];
  coverImage?: File;
  gallery?: File[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
  status?: EventStatus;
}

export interface EventFilters {
  status?: EventStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}

export interface EventStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  rejectedEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
}
