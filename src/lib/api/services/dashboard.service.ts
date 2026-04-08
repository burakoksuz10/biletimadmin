// Dashboard Service
// Uses available API endpoints to fetch dashboard data

import { apiClient } from "../client";
import { organizationsService } from "./organizations.service";
import { eventsService } from "./events.service";

// Types for dashboard data
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

class DashboardService {
  /**
   * Get dashboard statistics
   * Uses organization stats endpoint
   * Requires organization_id - gets from first available organization
   */
  async getStats(organizationId?: number): Promise<DashboardStats> {
    try {
      // If no organizationId provided, try to get from user's organizations
      if (!organizationId) {
        const orgsResponse = await apiClient.get<any>("/organizations");
        let organizations: any[] = [];

        if (orgsResponse.data && Array.isArray(orgsResponse.data)) {
          organizations = orgsResponse.data;
        } else if (orgsResponse.data?.data && Array.isArray(orgsResponse.data.data)) {
          organizations = orgsResponse.data.data;
        } else if (Array.isArray(orgsResponse)) {
          organizations = orgsResponse;
        }

        if (organizations.length > 0) {
          organizationId = organizations[0].id;
        } else {
          throw new Error("Organizasyon bulunamadı");
        }
      }

      // Get organization stats
      if (!organizationId) {
        throw new Error("Organizasyon ID bulunamadı");
      }
      const stats = await organizationsService.getStats(organizationId);

      // Transform to dashboard stats format
      return {
        totalRevenue: stats.total_revenue || 0,
        ticketsSold: stats.total_orders || 0, // Using orders as ticket count proxy
        refundedAmount: 0, // Not available in current API
        payoutsIssued: 0, // Not available in current API
        revenueChange: 0, // Not available in current API
        ticketsChange: 0, // Not available in current API
        refundsChange: 0, // Not available in current API
        payoutsChange: 0, // Not available in current API
      };
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
      // Return default stats on error
      return {
        totalRevenue: 0,
        ticketsSold: 0,
        refundedAmount: 0,
        payoutsIssued: 0,
        revenueChange: 0,
        ticketsChange: 0,
        refundsChange: 0,
        payoutsChange: 0,
      };
    }
  }

  /**
   * Get events count for dashboard
   */
  async getEventsCount(): Promise<{
    total: number;
    active: number;
    draft: number;
  }> {
    try {
      const response = await apiClient.get<any>("/events");

      let events: any[] = [];
      if (response.data && Array.isArray(response.data)) {
        events = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        events = response.data.data;
      } else if (Array.isArray(response)) {
        events = response;
      }

      const total = events.length;
      const active = events.filter((e) => e.status === "published").length;
      const draft = events.filter((e) => e.status === "draft").length;

      return { total, active, draft };
    } catch (error) {
      console.error("Events count fetch error:", error);
      return { total: 0, active: 0, draft: 0 };
    }
  }

  /**
   * Get venues count
   */
  async getVenuesCount(): Promise<number> {
    try {
      const response = await apiClient.get<any>("/venues");

      let venues: any[] = [];
      if (response.data && Array.isArray(response.data)) {
        venues = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        venues = response.data.data;
      } else if (Array.isArray(response)) {
        venues = response;
      }

      return venues.length;
    } catch (error) {
      console.error("Venues count fetch error:", error);
      return 0;
    }
  }

  /**
   * Get users count (excluding customers)
   */
  async getUsersCount(): Promise<number> {
    try {
      const response = await apiClient.get<any>("/users", {
        params: { exclude_roles: ["customer"] }
      });

      let users: any[] = [];
      if (response.data?.data?.users && Array.isArray(response.data.data.users)) {
        users = response.data.data.users;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response)) {
        users = response;
      }

      return users.length;
    } catch (error) {
      console.error("Users count fetch error:", error);
      return 0;
    }
  }

  /**
   * Get customers count
   */
  async getCustomersCount(): Promise<number> {
    try {
      const response = await apiClient.get<any>("/users/by-role/customers");

      let customers: any[] = [];
      if (response.data?.data?.customers && Array.isArray(response.data.data.customers)) {
        customers = response.data.data.customers;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        customers = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        customers = response.data;
      } else if (Array.isArray(response)) {
        customers = response;
      }

      return customers.length;
    } catch (error) {
      console.error("Customers count fetch error:", error);
      return 0;
    }
  }

  /**
   * Get complete dashboard data
   * Combines all available API data
   */
  async getDashboardData(organizationId?: number): Promise<{
    stats: DashboardStats;
    eventsCount: { total: number; active: number; draft: number };
    venuesCount: number;
    usersCount: number;
    customersCount: number;
  }> {
    const [stats, eventsCount, venuesCount, usersCount, customersCount] = await Promise.all([
      this.getStats(organizationId),
      this.getEventsCount(),
      this.getVenuesCount(),
      this.getUsersCount(),
      this.getCustomersCount(),
    ]);

    return {
      stats,
      eventsCount,
      venuesCount,
      usersCount,
      customersCount,
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
