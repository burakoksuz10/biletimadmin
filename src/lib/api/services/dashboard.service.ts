// Dashboard Service
// Optimized: Uses cached API calls, reduces redundant requests

import { apiClient } from "../client";
import { organizationsService } from "./organizations.service";

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
   * Get complete dashboard data
   * All requests run in parallel for maximum speed
   */
  async getDashboardData(organizationId?: number): Promise<{
    stats: DashboardStats;
    eventsCount: { total: number; active: number; draft: number };
    venuesCount: number;
    usersCount: number;
    customersCount: number;
  }> {
    // Run all requests in parallel - apiClient.get caches automatically
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

  /**
   * Get dashboard statistics
   */
  async getStats(organizationId?: number): Promise<DashboardStats> {
    try {
      if (!organizationId) {
        const orgsResponse = await apiClient.get<any>("/organizations");
        let organizations: any[] = [];

        if (orgsResponse?.data && Array.isArray(orgsResponse.data)) {
          organizations = orgsResponse.data;
        } else if (orgsResponse?.data?.data && Array.isArray(orgsResponse.data.data)) {
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

      if (!organizationId) {
        throw new Error("Organizasyon ID bulunamadı");
      }

      const stats = await organizationsService.getStats(organizationId);

      return {
        totalRevenue: stats.total_revenue || 0,
        ticketsSold: stats.total_orders || 0,
        refundedAmount: 0,
        payoutsIssued: 0,
        revenueChange: 0,
        ticketsChange: 0,
        refundsChange: 0,
        payoutsChange: 0,
      };
    } catch (error: any) {
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
   * Get events count
   */
  async getEventsCount(): Promise<{ total: number; active: number; draft: number }> {
    try {
      const response = await apiClient.get<any>("/events");
      const events = this.extractArray(response);

      return {
        total: events.length,
        active: events.filter((e) => e.status === "published").length,
        draft: events.filter((e) => e.status === "draft").length,
      };
    } catch (error) {
      return { total: 0, active: 0, draft: 0 };
    }
  }

  /**
   * Get venues count
   */
  async getVenuesCount(): Promise<number> {
    try {
      const response = await apiClient.get<any>("/venues");
      return this.extractArray(response).length;
    } catch (error) {
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
      if (response?.data?.data?.users && Array.isArray(response.data.data.users)) {
        users = response.data.data.users;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        users = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response)) {
        users = response;
      }

      return users.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get customers count
   */
  async getCustomersCount(): Promise<number> {
    try {
      const response = await apiClient.get<any>("/users/by-role/customers");
      return this.extractArray(response).length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Helper: Extract array from various API response formats
   */
  private extractArray(response: any): any[] {
    if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
