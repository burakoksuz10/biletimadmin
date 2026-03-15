// Dashboard Types

export interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  refundedAmount: number;
  payoutsIssued: number;
  revenueChange: number;
  ticketsChange: number;
  refundsChange: number;
  payoutsChange: number;
}

export interface SalesDataPoint {
  month: string;
  income: number;
  expenses?: number;
}

export interface BestVisitedLocation {
  country: string;
  amount: number;
  percentage: number;
}

export interface RecentPayout {
  id: string;
  organizer: string;
  amount: number;
  contact: string;
  requestedOn: string;
  status: "pending" | "approved";
  processedOn?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}
