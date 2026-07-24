export type DeviceStatus = 'online' | 'offline' | 'busy' | 'syncing';

export interface DeviceSim {
  slot: 1 | 2;
  carrier: string;
  phoneNumber: string;
  signalStrength: number; // 0 to 100%
  status: 'active' | 'inactive';
}

export interface AndroidDevice {
  id: string;
  name: string;
  model: string;
  androidVersion: string;
  batteryLevel: number;
  isPluggedIn: boolean;
  status: DeviceStatus;
  lastSeen: string;
  sims: DeviceSim[];
  smsSentToday: number;
  smsLimitDaily: number;
}

export type SmsStatus = 'delivered' | 'sent' | 'queued' | 'pending' | 'failed';

export interface SmsLog {
  id: string;
  recipient: string;
  message: string;
  deviceId: string;
  deviceName: string;
  simSlot: number;
  carrier: string;
  status: SmsStatus;
  createdAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  cost: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  keyMasked: string;
  fullKey?: string;
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsedAt: string;
  permissions: string[];
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'paused' | 'failed';
  secret: string;
  createdAt: string;
  lastDeliveryStatus?: '200 OK' | '500 Error' | '404 Not Found';
  lastTriggeredAt?: string;
}

export interface OrganisationInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  smsSignature: string;
  logoUrl?: string;
  timezone: string;
  webhookSecret: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  smsQuotaMonthly: number;
  maxDevices: number;
  features: string[];
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  organisationName: string;
  twoFactorEnabled: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
