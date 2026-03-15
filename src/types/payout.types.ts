// Payout Types

export interface PayoutRequest {
  id: string;
  organizer: string;
  organizerId: string;
  amount: number;
  contact: string;
  email: string;
  requestedOn: string;
  status: PayoutStatus;
  processedOn?: string;
  notes?: string;
}

export type PayoutStatus = "pending" | "approved" | "rejected";

export interface CreatePayoutRequest {
  organizerId: string;
  amount: number;
  notes?: string;
}

export interface PayoutFilters {
  status?: PayoutStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PayoutStats {
  totalRequested: number;
  totalApproved: number;
  totalRejected: number;
  totalAmount: number;
  pendingAmount: number;
}
