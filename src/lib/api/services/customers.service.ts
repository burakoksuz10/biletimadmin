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
    }>("/customers", { params: filters });

    return response;
  }

  /**
   * Get customer by ID with full details
   */
  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<{ data: Customer }>(
      `/customers/${id}`
    );

    return response.data;
  }

  /**
   * Update customer
   */
  async update(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<{ data: Customer }>(
      `/customers/${id}`,
      data
    );

    return response.data;
  }

  /**
   * Delete customer (soft delete)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  }

  /**
   * Get customer orders
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
    }>(`/customers/${id}/orders`, { params });

    return response;
  }

  /**
   * Get customer tickets
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
    }>(`/customers/${id}/tickets`, { params });

    return response;
  }

  /**
   * Get customer detailed statistics
   */
  async getStats(id: number): Promise<CustomerDetailedStats> {
    const response = await apiClient.get<{ data: CustomerDetailedStats }>(
      `/customers/${id}/stats`
    );

    return response.data;
  }

  /**
   * Get customer activity history
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
    }>(`/customers/${id}/activity`, { params });

    return response;
  }

  /**
   * Get general customer statistics
   */
  async getGeneralStats(): Promise<CustomerStats> {
    const response = await apiClient.get<{ data: CustomerStats }>(
      "/customers/stats"
    );

    return response.data;
  }

  /**
   * Get top spending customers
   */
  async getTopSpenders(limit?: number): Promise<TopCustomer[]> {
    const response = await apiClient.get<{ data: TopCustomer[] }>(
      "/customers/top-spenders",
      { params: { limit } }
    );

    return response.data;
  }

  /**
   * Get customer segmentation
   */
  async getSegmentation(): Promise<CustomerSegmentation> {
    const response = await apiClient.get<{ data: CustomerSegmentation }>(
      "/customers/segments"
    );

    return response.data;
  }

  /**
   * Export customers
   */
  async exportCustomers(
    format: "csv" | "excel",
    filters?: CustomerFilters
  ): Promise<Blob> {
    const response = await apiClient.get<Blob>("/customers/export", {
      params: { ...filters, format },
      responseType: "blob",
    });

    return response;
  }

  /**
   * Bulk action on customers
   */
  async bulkAction(
    action: "suspend" | "activate" | "ban" | "send_email",
    customerIds: number[],
    data?: any
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>("/customers/bulk-action", {
      action,
      customer_ids: customerIds,
      data,
    });

    return response;
  }
}

// Export singleton instance
export const customersService = new CustomersService();
