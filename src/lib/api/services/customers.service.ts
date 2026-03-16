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
    try {
      const response = await apiClient.get<any>("/users/by-role/customers", {
        params: filters
      });

      // Backend API formatı: { success: true, data: { customers: [...], pagination: {...} } }
      // Axios response.data ile geldiği için response.data.data.customers erişmemiz gerekiyor
      if (response.data && response.data.data && response.data.data.customers && Array.isArray(response.data.data.customers)) {
        
        const customers = response.data.data.customers;
        const pagination = response.data.data.pagination;
        
        return {
          data: customers,
          meta: {
            current_page: pagination?.current_page || 1,
            per_page: pagination?.per_page || customers.length,
            total: pagination?.total || customers.length,
            last_page: pagination?.total_pages || 1
          }
        };
      }

      // Eski format için fallback: { success: true, data: [...], pagination: {...} }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        
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
      return {
        data: [],
        meta: {
          current_page: 1,
          per_page: 0,
          total: 0,
          last_page: 1
        }
      };
    } catch (error: any) {
      console.error("❌ [CUSTOMERS SERVICE] API çağrısı hatası:", error);
      throw error;
    }
  }

  /**
   * Get customer by ID with full details
   * Uses /api/v1/users/{id} endpoint
   */
  async getById(id: number): Promise<Customer> {
    const response = await apiClient.get<any>(
      `/users/${id}`
    );

    console.log("Müşteri detay API yanıtı:", response);

    // Backend API formatı: { success: true, data: { ...customer } }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // Eğer yanıt data içinde ise (fallback)
    if (response.data && response.data.id) {
      return response.data;
    }

    // Eğer yanıt doğrudan müşteri nesnesi ise (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Müşteri bulunamadı");
  }

  /**
   * Update customer
   * Uses /api/v1/users/{id} endpoint
   */
  async update(id: number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<any>(
      `/users/${id}`,
      data
    );

    // Backend API formatı: { success: true, data: { ...customer }, message: "..." }
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data;
    }

    // Eğer yanıt data içinde ise (fallback)
    if (response.data && response.data.id) {
      return response.data;
    }

    // Eğer yanıt doğrudan müşteri nesnesi ise (fallback)
    if (response.id) {
      return response;
    }

    throw new Error("Müşteri güncellenemedi");
  }

  /**
   * Delete customer (soft delete)
   * Uses /api/v1/users/{id} endpoint
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
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
      `/users/${id}/orders`,
      { params }
    );

    // Backend API formatı: { success: true, data: { orders: [...], pagination: {...} } }
    if (response.data && response.data.data && response.data.data.orders && Array.isArray(response.data.data.orders)) {
      const pagination = response.data.data.pagination;
      return {
        data: response.data.data.orders,
        meta: {
          current_page: pagination?.current_page || 1,
          per_page: pagination?.per_page || response.data.data.orders.length,
          total: pagination?.total || response.data.data.orders.length,
          last_page: pagination?.total_pages || 1
        }
      };
    }

    // Eğer yanıt doğrudan bir array ise (fallback)
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

    // Eğer yanıt data içinde array ise (fallback)
    if (response.data && Array.isArray(response.data)) {
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
    const response = await apiClient.get<any>(`/users/${id}/tickets`, { params });

    // Backend API formatı: { success: true, data: { tickets: [...], pagination: {...} } }
    if (response.data && response.data.data && response.data.data.tickets && Array.isArray(response.data.data.tickets)) {
      const pagination = response.data.data.pagination;
      return {
        data: response.data.data.tickets,
        meta: {
          current_page: pagination?.current_page || 1,
          per_page: pagination?.per_page || response.data.data.tickets.length,
          total: pagination?.total || response.data.data.tickets.length,
          last_page: pagination?.total_pages || 1
        }
      };
    }

    // Eğer yanıt zaten doğru formatta ise (fallback)
    if (response.data && Array.isArray(response.data.data)) {
      return response.data;
    }

    // Eğer yanıt doğrudan doğru formatta ise (fallback)
    if (Array.isArray(response.data)) {
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
   * Get customer detailed statistics
   * Uses /api/v1/users/{id}/stats endpoint
   */
  async getStats(id: number): Promise<CustomerDetailedStats> {
    const response = await apiClient.get<any>(
      `/users/${id}/stats`
    );

    // Backend API formatı: { success: true, data: { ...stats } }
    if (response.data && response.data.data && (response.data.data.total_orders !== undefined || response.data.data.total_spent !== undefined)) {
      return response.data.data;
    }

    // Eğer yanıt data içinde ise (fallback)
    if (response.data && (response.data.total_orders !== undefined || response.data.total_spent !== undefined)) {
      return response.data;
    }

    // Eğer yanıt doğrudan stats nesnesi ise (fallback)
    if (response.total_orders !== undefined || response.total_spent !== undefined) {
      return response;
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
      `/users/${id}/activity`,
      { params }
    );

    // Backend API formatı: { success: true, data: { activities: [...], pagination: {...} } }
    if (response.data && response.data.data && response.data.data.activities && Array.isArray(response.data.data.activities)) {
      const pagination = response.data.data.pagination;
      return {
        data: response.data.data.activities,
        meta: {
          current_page: pagination?.current_page || 1,
          per_page: pagination?.per_page || response.data.data.activities.length,
          total: pagination?.total || response.data.data.activities.length,
          last_page: pagination?.total_pages || 1
        }
      };
    }

    // Eğer yanıt doğrudan bir array ise (fallback)
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

    // Eğer yanıt data içinde array ise (fallback)
    if (response.data && Array.isArray(response.data)) {
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
    const response = await apiClient.get<any>(
      "/users/by-role/customers/stats"
    );

    // Backend API formatı: { success: true, data: { ...stats } }
    if (response.data && response.data.data) {
      return response.data.data;
    }

    // Fallback
    if (response.data) {
      return response.data;
    }

    throw new Error("İstatistikler alınamadı");
  }

  /**
   * Get top spending customers
   * Uses /api/v1/users/by-role/customers/top-spenders endpoint
   */
  async getTopSpenders(limit?: number): Promise<TopCustomer[]> {
    const response = await apiClient.get<any>(
      "/users/by-role/customers/top-spenders",
      { params: { limit } }
    );

    // Backend API formatı: { success: true, data: { top_spenders: [...] } }
    if (response.data && response.data.data && response.data.data.top_spenders && Array.isArray(response.data.data.top_spenders)) {
      return response.data.data.top_spenders;
    }

    // Fallback: { success: true, data: [...] }
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // Fallback
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  }

  /**
   * Get customer segmentation
   * Uses /api/v1/users/by-role/customers/segments endpoint
   */
  async getSegmentation(): Promise<CustomerSegmentation> {
    const response = await apiClient.get<any>(
      "/users/by-role/customers/segments"
    );

    // Backend API formatı: { success: true, data: { segments: [...] } }
    if (response.data && response.data.data && response.data.data.segments && Array.isArray(response.data.data.segments)) {
      return response.data.data;
    }

    // Fallback
    if (response.data && response.data.data) {
      return response.data.data;
    }

    throw new Error("Segmentasyon alınamadı");
  }

  /**
   * Export customers
   * Uses /api/v1/users/by-role/customers/export endpoint
   */
  async exportCustomers(
    format: "csv" | "excel",
    filters?: CustomerFilters
  ): Promise<Blob> {
    const response = await apiClient.get<Blob>("/users/by-role/customers/export", {
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
