// Customers Service
// Handles all customer-related API operations

import { apiClient } from "../client";
import type {
  Customer,
  CustomerListItem,
  CustomerOrder,
  CustomerTicket,
  CustomerStats,
  TopCustomer,
  CustomerDetailedStats,
  CustomerActivity,
  CustomerFilters,
  UpdateCustomerRequest,
  CustomerSegmentation,
} from "@/types/customer.types";

class CustomersService {
  /**
   * Get all customers with filters
   * Uses /api/v1/users/by-role/customers endpoint
   */
  async getAll(filters?: CustomerFilters): Promise<{
    data: CustomerListItem[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    const response = await apiClient.get<{
      data: CustomerListItem[];
      meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
      };
    }>("/api/v1/users/by-role/customers", {
      params: filters
    });

    return response;
  }

  /**
   * Get customer by ID with full details
   * Uses /api/v1/users/{id} endpoint
   */
  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<{ data: Customer }>(
      `/api/v1/users/${id}`
    );

    return response.data;
  }

  /**
   * Update customer
   * Uses /api/v1/users/{id} endpoint
   */
  async update(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<{ data: Customer }>(
      `/api/v1/users/${id}`,
      data
    );

    return response.data;
  }

  /**
   * Delete customer (soft delete)
   * Uses /api/v1/users/{id} endpoint
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`);
  }

  /**
   * Get customer orders
   * Uses /api/v1/users/{id}/orders endpoint
   */
  async getOrders(
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      status?: string;
    }
  ): Promise<{
    data: CustomerOrder[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    const response = await apiClient.get<{
      data: CustomerOrder[];
      meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
      };
    }>(`/api/v1/users/${id}/orders`, { params });

    return response;
  }

  /**
   * Get customer tickets
   * Uses /api/v1/users/{id}/tickets endpoint
   */
  async getTickets(
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      status?: string;
    }
  ): Promise<{
    data: CustomerTicket[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    const response = await apiClient.get<{
      data: CustomerTicket[];
      meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
      };
    }>(`/api/v1/users/${id}/tickets`, { params });

    return response;
  }

  /**
   * Get customer detailed statistics
   * Uses /api/v1/users/{id}/stats endpoint
   */
  async getStats(id: number): Promise<CustomerDetailedStats> {
    const response = await apiClient.get<{ data: CustomerDetailedStats }>(
      `/api/v1/users/${id}/stats`
    );

    return response.data;
  }

  /**
   * Get customer activity history
   * Uses /api/v1/users/{id}/activity endpoint
   */
  async getActivity(
    id: number,
    params?: {
      page?: number;
      per_page?: number;
      activity_type?: string;
    }
  ): Promise<{
    data: CustomerActivity[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    const response = await apiClient.get<{
      data: CustomerActivity[];
      meta: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
      };
    }>(`/api/v1/users/${id}/activity`, { params });

    return response;
  }

  /**
   * Get general customer statistics
   * Uses /api/v1/users/by-role/customers/stats endpoint
   */
  async getGeneralStats(): Promise<CustomerStats> {
    const response = await apiClient.get<{ data: CustomerStats }>(
      "/api/v1/users/by-role/customers/stats"
    );

    return response.data;
  }

  /**
   * Get top spending customers
   * Uses /api/v1/users/by-role/customers/top-spenders endpoint
   */
  async getTopSpenders(limit?: number): Promise<TopCustomer[]> {
    const response = await apiClient.get<{ data: TopCustomer[] }>(
      "/api/v1/users/by-role/customers/top-spenders",
      { params: { limit } }
    );

    return response.data;
  }

  /**
   * Get customer segmentation
   * Uses /api/v1/users/by-role/customers/segments endpoint
   */
  async getSegmentation(): Promise<CustomerSegmentation> {
    const response = await apiClient.get<{ data: CustomerSegmentation }>(
      "/api/v1/users/by-role/customers/segments"
    );

    return response.data;
  }

  /**
   * Export customers
   * Uses /api/v1/users/by-role/customers/export endpoint
   */
  async exportCustomers(
    format: "csv" | "excel",
    filters?: CustomerFilters
  ): Promise<Blob> {
    const response = await apiClient.get<Blob>("/api/v1/users/by-role/customers/export", {
      params: {
        ...filters,
        format
      },
      responseType: "blob",
    });

    return response;
  }

  /**
   * Bulk action on customers
   * Uses /api/v1/users/bulk-action endpoint
   */
  async bulkAction(
    action: "suspend" | "activate" | "ban" | "send_email",
    customerIds: number[],
    data?: any
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/api/v1/users/bulk-action", {
      action,
      user_ids: customerIds,
      data,
    });

    return response;
  }
}

// Export singleton instance
export const customersService = new CustomersService();
