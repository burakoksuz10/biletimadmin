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
   * Uses /users endpoint with role=customer filter
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
    }>("/users", {
      params: {
        role: "customer", // Filter for customers only
        ...filters
      }
    });

    return response;
  }

  /**
   * Get customer by ID with full details
   * Uses /users endpoint
   */
  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<{ data: Customer }>(
      `/users/${id}`
    );

    return response.data;
  }

  /**
   * Update customer
   * Uses /users endpoint
   */
  async update(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<{ data: Customer }>(
      `/users/${id}`,
      data
    );

    return response.data;
  }

  /**
   * Delete customer (soft delete)
   * Uses /users endpoint
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  /**
   * Get customer orders
   * Uses /users endpoint
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
    }>(`/users/${id}/orders`, { params });

    return response;
  }

  /**
   * Get customer tickets
   * Uses /users endpoint
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
    }>(`/users/${id}/tickets`, { params });

    return response;
  }

  /**
   * Get customer detailed statistics
   * Uses /users endpoint
   */
  async getStats(id: number): Promise<CustomerDetailedStats> {
    const response = await apiClient.get<{ data: CustomerDetailedStats }>(
      `/users/${id}/stats`
    );

    return response.data;
  }

  /**
   * Get customer activity history
   * Uses /users endpoint
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
    }>(`/users/${id}/activity`, { params });

    return response;
  }

  /**
   * Get general customer statistics
   * Uses /users endpoint with role=customer filter
   */
  async getGeneralStats(): Promise<CustomerStats> {
    const response = await apiClient.get<{ data: CustomerStats }>(
      "/users/stats",
      { params: { role: "customer" } }
    );

    return response.data;
  }

  /**
   * Get top spending customers
   * Uses /users endpoint with role=customer filter
   */
  async getTopSpenders(limit?: number): Promise<TopCustomer[]> {
    const response = await apiClient.get<{ data: TopCustomer[] }>(
      "/users/top-spenders",
      { params: { role: "customer", limit } }
    );

    return response.data;
  }

  /**
   * Get customer segmentation
   * Uses /users endpoint with role=customer filter
   */
  async getSegmentation(): Promise<CustomerSegmentation> {
    const response = await apiClient.get<{ data: CustomerSegmentation }>(
      "/users/segments",
      { params: { role: "customer" } }
    );

    return response.data;
  }

  /**
   * Export customers
   * Uses /users endpoint with role=customer filter
   */
  async exportCustomers(
    format: "csv" | "excel",
    filters?: CustomerFilters
  ): Promise<Blob> {
    const response = await apiClient.get<Blob>("/users/export", {
      params: {
        role: "customer",
        ...filters,
        format
      },
      responseType: "blob",
    });

    return response;
  }

  /**
   * Bulk action on customers
   * Uses /users endpoint
   */
  async bulkAction(
    action: "suspend" | "activate" | "ban" | "send_email",
    customerIds: number[],
    data?: any
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/users/bulk-action", {
      action,
      user_ids: customerIds,
      data,
    });

    return response;
  }
}

// Export singleton instance
export const customersService = new CustomersService();
