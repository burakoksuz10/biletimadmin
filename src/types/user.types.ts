// User Management Types

import { UserRole, UserStatus } from "./auth.types";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive?: string;
  eventsCreated?: number;
  ticketsPurchased?: number;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  organizers: number;
  attendees: number;
}

export type { UserRole, UserStatus, User } from "./auth.types";
