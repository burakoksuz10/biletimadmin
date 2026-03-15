// Ticket Types

export interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  price: number;
  quantity: number;
  totalAmount: number;
  status: TicketStatus;
  purchasedAt: string;
  qrCode?: string;
  seatNumber?: string;
}

export type TicketStatus = "valid" | "used" | "refunded" | "expired" | "cancelled";

export interface TicketSale {
  id: string;
  eventName: string;
  ticketType: string;
  buyer: string;
  contact: string;
  quantity: number;
  amount: number;
  date: string;
  status: TicketStatus;
}

export interface TicketFilters {
  eventId?: string;
  status?: TicketStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
