// Mock Data - Dashboard
import type { DashboardStats, SalesDataPoint, BestVisitedLocation, RecentPayout } from "@/types/dashboard.types";

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 985000,
  ticketsSold: 30000,
  refundedAmount: 600,
  payoutsIssued: 300,
  revenueChange: 15.2,
  ticketsChange: 28.4,
  refundsChange: -12.4,
  payoutsChange: -12.4,
};

export const mockSalesData: SalesDataPoint[] = [
  { month: "Jan", income: 20000 },
  { month: "Feb", income: 45000 },
  { month: "Mar", income: 30000 },
  { month: "Apr", income: 55000 },
  { month: "May", income: 40000 },
  { month: "Jun", income: 65000 },
  { month: "Jul", income: 50000 },
  { month: "Aug", income: 80000 },
  { month: "Sep", income: 60000 },
  { month: "Oct", income: 75000 },
  { month: "Nov", income: 85000 },
  { month: "Dec", income: 95000 },
];

export const mockBestVisited: BestVisitedLocation[] = [
  { country: "Istanbul, Turkey", amount: 32580, percentage: 34 },
  { country: "Antalya, Turkey", amount: 24890, percentage: 26 },
  { country: "Ankara, Turkey", amount: 18756, percentage: 20 },
  { country: "Izmir, Turkey", amount: 12340, percentage: 13 },
  { country: "Bursa, Turkey", amount: 6780, percentage: 7 },
];

export const mockRecentPayouts: RecentPayout[] = [
  {
    id: "pay-001",
    organizer: "William Jones",
    amount: 25000,
    contact: "+1234567890",
    requestedOn: "2025-01-15",
    status: "pending",
  },
  {
    id: "pay-002",
    organizer: "Janet Anderson",
    amount: 15000,
    contact: "+1234567891",
    requestedOn: "2025-01-14",
    status: "approved",
    processedOn: "2025-01-15",
  },
  {
    id: "pay-003",
    organizer: "Robert Wilson",
    amount: 32000,
    contact: "+1234567892",
    requestedOn: "2025-01-13",
    status: "pending",
  },
  {
    id: "pay-004",
    organizer: "Emily Davis",
    amount: 18500,
    contact: "+1234567893",
    requestedOn: "2025-01-12",
    status: "approved",
    processedOn: "2025-01-13",
  },
  {
    id: "pay-005",
    organizer: "Michael Brown",
    amount: 45000,
    contact: "+1234567894",
    requestedOn: "2025-01-11",
    status: "pending",
  },
];
