// Types pour le panneau super-admin (staff plateforme, role 'Admin')

export interface PlatformDashboardStats {
  users: { total: number; new_this_month: number };
  devices: { online: number; offline: number; total: number };
  sms: {
    today: number;
    this_month: number;
    failed_this_month: number;
    sent_via_device_this_month: number;
    sent_via_mtn_this_month: number;
  };
  subscriptions_by_plan: Record<string, number>;
  revenue_this_month: number;
  // Coût réel dû à MTN ce mois-ci (SMS réseau réellement envoyés × tarif
  // unitaire courant) et bénéfice net (revenu - ce coût) — la marge
  // disponible pour l'hébergement et les autres charges.
  mtn_cost_this_month: number;
  sms_unit_price: number;
  net_profit_this_month: number;
  latest_signups: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
  }>;
}

export interface PlatformUsersPage {
  data: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
    devices_count: number;
    sms_messages_count: number;
    active_subscription?: { plan?: { name: string } } | null;
  }>;
  current_page: number;
  last_page: number;
  total: number;
}

export interface AnalyticsOverview {
  configured: boolean;
  error?: boolean;
  message?: string;
  totals?: {
    active_users: number;
    sessions: number;
    page_views: number;
    clicks: number;
  };
  by_country?: Array<{ country: string; active_users: number }>;
  by_date?: Array<{ date: string; sessions: number; active_users: number }>;
}
