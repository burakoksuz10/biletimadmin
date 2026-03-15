// Backend API Response Types
// All responses from Biletleme Platform Backend follow these formats

// Standard success response wrapper
export interface ApiResponse<T> {
  data: T;
}

// Paginated response for list endpoints
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Error response structure
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Common API response types
export interface MessageResponse {
  message: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}
