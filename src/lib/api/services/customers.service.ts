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
    console.log("API çağrısı yapılıyor: /api/v1/users/by-role/customers", filters);
    
    const response = await apiClient.get<any>("/api/v1/users/by-role/customers", {
      params: filters
    });

    console.log("Ham API yanıtı:", response);

    // Backend API formatı: { success: true, message: "...", data: [...], pagination: {...} }
    // Axios response.data ile geldiği için response.data.data erişmemiz gerekiyor
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log("Yanıt data.data içinde array, uzunluk:", response.data.data.length);
      
      const customers = response.data.data;
      const pagination = response.data.pagination;
      
      return {
        data: customers,
        meta: {
          current_page: pagination?.current_page || 1,
          per_page: pagination?.per_page || customers.length,
          total: pagination?.total || customers.length,
          last_page: pagination?.last_page || 1
        }
      };
    }

    // Eğer yanıt doğrudan bir array ise (fallback)
    if (Array.isArray(response)) {
      console.log("Yanıt doğrudan array, uzunluk:", response.length);
      return {
        data: response,
        meta: {
          current_page: 1,
          per_page: response.length,
          total: response.length,
          last_page: 1
        }
      };
    }

    // Eğer yanıt response.data içinde array ise (fallback)
    if (response.data && Array.isArray(response.data)) {
      console.log("Yanıt response.data içinde array, uzunluk:", response.data.length);
      return {
        data: response.data,
        meta: {
          current_page: 1,
          per_page: response.data.length,
          total: response.data.length,
          last_page: 1
        }
      };
    }

    // Hiçbir durum uymazsa boş array dön
    console.warn("Beklenmeyen API yanıt formatı:", response);
    return {
      data: [],
      meta: {
        current_page: 1,
        per_page: 0,
        total: 0,
        last_page: 1
      }
    };
  }

  /**
   * Get customer by ID with full details
   * Uses /api/v1/users/{id} endpoint
   */
  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<any>(
      `/api/v1/users/${id}`
    );

    // Eğer yanıt doğrudan müşteri nesnesi ise
    if (response.id) {
      return response;
    }

    // Eğer yanıt data içinde ise
    if (response.data && response.data.id) {
      return response.data;
    }

    throw new Error("Müşteri bulunamadı");
  }

  /**
   * Update customer
   * Uses /api/v1/users/{id} endpoint
   */
  async update(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<any>(
      `/api/v1/users/${id}`,
      data
    );

    // Eğer yanıt doğrudan müşteri nesnesi ise
    if (response.id) {
      return response;
    }

    // Eğer yanıt data içinde ise
    if (response.data && response.data.id) {
      return response.data;
    }

    throw new Error("Müşteri güncellenemedi");
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
    const response = await apiClient.get<any>(
      `/api/v1/users/${id}/orders`,
      { params }
    );

    // Eğer yanıt doğrudan bir array ise
    if (Array.isArray(response)) {
      return {
        data: response,
        meta: {
          current_page: 1,
          per_page: response.length,
          total: response.length,
          last_page: 1
        }
      };
    }

    // Eğer yanıt zaten doğru formatta ise
    if (response.data && Array.isArray(response.data)) {
      return response;
    }

    // Hiçbir durum uymazsa boş array dön
    return {
      data: [],
      meta: {
        current_page: 1,
        per_page: 0,
        total: 0,
        last_page: 1
      }
    };
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
    const response = await apiClient.get<any>(
      `/api/v1/users/${id}/stats`
    );

    // Eğer yanıt doğrudan stats nesnesi ise
    if (response.total_orders !== undefined || response.total_spent !== undefined) {
      return response;
    }

    // Eğer yanıt data içinde ise
    if (response.data && (response.data.total_orders !== undefined || response.data.total_spent !== undefined)) {
      return response.data;
    }

    // Hiçbir durum uymazsa boş stats dön
    return {
      total_orders: 0,
      total_spent: 0,
      total_tickets: 0,
      events_attended: 0,
      upcoming_events: 0,
      favorite_categories: [],
      favorite_venues: [],
      average_order_value: 0,
      first_order_date: undefined,
      last_order_date: undefined,
      lifetime_value: 0,
      monthly_spending: []
    };
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
    const response = await apiClient.get<any>(
      `/api/v1/users/${id}/activity`,
      { params }
    );

    // Eğer yanıt doğrudan bir array ise
    if (Array.isArray(response)) {
      return {
        data: response,
        meta: {
          current_page: 1,
          per_page: response.length,
          total: response.length,
          last_page: 1
        }
      };
    }

    // Eğer yanıt zaten doğru formatta ise
    if (response.data && Array.isArray(response.data)) {
      return response;
    }

    // Hiçbir durum uymazsa boş array dön
    return {
      data: [],
      meta: {
        current_page: 1,
        per_page: 0,
        total: 0,
        last_page: 1
      }
    };
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
