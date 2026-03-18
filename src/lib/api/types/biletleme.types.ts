// Biletleme Platform Backend Entity Types
// These types match the backend database structure

// ============================================
// User & Authentication Types
// ============================================

export type BackendUserRole = "super_admin" | "org_admin" | "co_admin";

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: BackendUserRole;
  role_label?: string; // Backend provides Turkish label
  organization_id?: number | null;
  organizations?: Organization[]; // For CO_ADMIN with multiple orgs
  email_verified_at?: string;
  created_at: string;
  updated_at?: string;
  // Optional fields that may not be in login response
  phone?: string;
  avatar?: string;
  status?: "active" | "banned" | "suspended";
}

// ============================================
// Organization Types
// ============================================

export interface Organization {
  id: number;
  name: string;
  slug: string;
  logo_path?: string | null;
  description?: string | null;
  tax_number?: string | null;
  tax_administration?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  is_active: boolean;
  operator_id?: number | null;
  settings?: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string | null;
  tax_number?: string | null;
  tax_administration?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  is_active?: boolean;
  operator_id?: number | null;
}

export interface UpdateOrganizationRequest extends Partial<CreateOrganizationRequest> {}

// ============================================
// Venue Types
// ============================================
// Note: Venues are now independent from organizations (no organization_id)

export interface Venue {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  image?: string | null;
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface CreateVenueRequest {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
}

export interface UpdateVenueRequest extends Partial<CreateVenueRequest> {
  status?: "active" | "inactive" | "maintenance";
}

// ============================================
// Event Types
// ============================================

export type EventStatus = "draft" | "published" | "cancelled" | "completed" | "ongoing";

export interface Event {
  id: number;
  organization_id: number;
  organization?: Organization;
  venue_id: number;
  venue?: Venue;
  category_id: number;
  category?: EventCategory;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  featured_image?: string;
  thumbnail?: string;
  ticket_price?: number;
  total_tickets?: number;
  available_tickets?: number;
  sold_tickets?: number;
  min_tickets_per_order?: number;
  max_tickets_per_order?: number;
  is_featured?: boolean;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  organization_id: number;
  venue_id: number;
  category_id: number;
  title: string;
  description?: string;
  short_description?: string;
  start_date: string;
  end_date: string;
  featured_image?: string;
  ticket_price?: number;
  total_tickets?: number;
  min_tickets_per_order?: number;
  max_tickets_per_order?: number;
  is_featured?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface UpdateEventStatusRequest {
  status: EventStatus;
}

// ============================================
// Event Category Types
// ============================================

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Ticket Types
// ============================================

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  available_quantity: number;
  max_per_order?: number;
  min_per_order?: number;
  sale_start_date?: string;
  sale_end_date?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export interface Order {
  id: number;
  event_id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  ticket_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Statistics Types
// ============================================

export interface DashboardStats {
  total_events: number;
  active_events: number;
  total_venues: number;
  total_users: number;
  total_orders: number;
  total_revenue: number;
  pending_payouts: number;
  approved_payouts: number;
}

export interface OrganizationStats {
  id: number;
  organization_id: number;
  total_events: number;
  active_events: number;
  total_venues: number;
  total_orders: number;
  total_revenue: number;
  period: string;
}

// ============================================
// Filter Types
// ============================================

export interface EventFilters {
  organization_id?: number;
  venue_id?: number;
  category_id?: number;
  status?: EventStatus;
  search?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
}

export interface VenueFilters {
  city?: string;
  country?: string;
  search?: string;
  status?: "active" | "inactive" | "maintenance";
  page?: number;
  per_page?: number;
}

export interface OrganizationFilters {
  search?: string;
  status?: "active" | "inactive" | "suspended";
  page?: number;
  per_page?: number;
}
