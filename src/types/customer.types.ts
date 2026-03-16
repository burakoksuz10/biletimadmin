// Customer Management Types

export type CustomerStatus = "active" | "suspended" | "banned";
export type CustomerSegment = "vip" | "regular" | "new" | "at_risk" | "lost" | "one_time";
export type CustomerGender = "male" | "female" | "other" | "prefer_not_to_say";

export interface Customer {
  // Temel Bilgiler
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  
  // Demografik Bilgiler
  gender?: CustomerGender;
  birth_date?: string; // YYYY-MM-DD
  city?: string;
  country?: string;
  postal_code?: string;
  address?: string;
  
  // Durum Bilgileri
  status: CustomerStatus;
  email_verified: boolean;
  phone_verified: boolean;
  
  // İstatistikler
  total_orders: number;
  total_spent: number;
  total_tickets: number;
  events_attended: number;
  upcoming_events: number;
  favorite_categories?: string[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_order_date?: string;
  last_login?: string;
  
  // Marketing
  newsletter_subscribed: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  
  // Segmentasyon
  customer_segment?: CustomerSegment;
  loyalty_points?: number;
}

export interface CustomerListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: CustomerStatus;
  customer_segment?: CustomerSegment;
  total_orders: number;
  total_spent: number;
  total_tickets: number;
  created_at: string;
  last_order_date?: string;
}

export interface CustomerOrder {
  id: number;
  order_number: string;
  event_id: number;
  event_title: string;
  event_date: string;
  venue_name: string;
  ticket_count: number;
  total_amount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  created_at: string;
  tickets?: CustomerTicket[];
}

export interface CustomerTicket {
  id: number;
  ticket_number: string;
  ticket_type: string;
  price: number;
  status: "valid" | "used" | "cancelled" | "expired";
  qr_code?: string;
}

export interface CustomerStats {
  // Genel İstatistikler
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  suspended_customers: number;
  banned_customers: number;
  
  // Finansal İstatistikler
  total_revenue: number;
  average_order_value: number;
  
  // Davranışsal İstatistikler
  average_tickets_per_customer: number;
  average_events_per_customer: number;
  repeat_customer_rate: number;
  
  // Segmentasyon
  vip_customers: number;
  regular_customers: number;
  new_customers: number;
  inactive_customers: number;
}

export interface TopCustomer {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  total_spent: number;
  total_orders: number;
  total_tickets: number;
}

export interface CustomerDetailedStats {
  total_orders: number;
  total_spent: number;
  total_tickets: number;
  events_attended: number;
  upcoming_events: number;
  favorite_categories: { name: string; count: number }[];
  favorite_venues: { name: string; count: number }[];
  average_order_value: number;
  first_order_date?: string;
  last_order_date?: string;
  lifetime_value: number;
  monthly_spending: { month: string; amount: number }[];
}

export interface CustomerActivity {
  id: number;
  type: "login" | "order" | "ticket_use" | "cancellation" | "review";
  description: string;
  created_at: string;
  metadata?: any;
}

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  segment?: CustomerSegment;
  city?: string;
  country?: string;
  min_spent?: number;
  max_spent?: number;
  date_from?: string;
  date_to?: string;
  sort_by?: "name" | "created_at" | "total_spent" | "last_order";
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  gender?: CustomerGender;
  birth_date?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  address?: string;
  status?: CustomerStatus;
  newsletter_subscribed?: boolean;
  sms_notifications?: boolean;
  email_notifications?: boolean;
}

export interface CustomerSegmentation {
  vip: number;
  regular: number;
  new: number;
  at_risk: number;
  lost: number;
  one_time: number;
}
