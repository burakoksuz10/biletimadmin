// Settings Types

export interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
}

export interface AccountSettings {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newEventAlert: boolean;
  ticketSaleAlert: boolean;
  payoutAlert: boolean;
  systemUpdates: boolean;
}

export interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublicKey?: string;
  paypalEnabled: boolean;
  paypalEmail?: string;
  bankTransferEnabled: boolean;
  bankName?: string;
  bankAccount?: string;
  bankIban?: string;
}

export interface TaxSettings {
  taxEnabled: boolean;
  taxRate: number;
  taxId?: string;
  taxName?: string;
  taxAddress?: string;
}

export interface LinkedAccount {
  id: string;
  provider: "stripe" | "paypal" | "bank";
  providerId: string;
  email?: string;
  lastFour?: string;
  isDefault: boolean;
  connectedAt: string;
}

export interface PlanSettings {
  currentPlan: "free" | "basic" | "pro" | "enterprise";
  planExpiresAt?: string;
  features: string[];
  limits: {
    events: number;
    tickets: number;
    organizers: number;
  };
}
