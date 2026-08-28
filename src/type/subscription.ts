import type { Plan } from './plan';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export type SmsChannel = 'device' | 'network';

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: SubscriptionStatus;
  sms_used: number;
  extra_sms_credit: number;
  current_period_start: string; // date (YYYY-MM-DD)
  current_period_end: string;   // date (YYYY-MM-DD)
  channel: SmsChannel;
  duration_months: number;
  sms_rate_applied: string | null; // decimal non casté côté back -> string
  amount_paid: string | null;
  created_at: string;
  updated_at: string;

  // Accesseurs calculés, exposés automatiquement par le backend (voir
  // Subscription::$appends côté Laravel) — jamais à recalculer côté front.
  sms_quota_total: number;
  sms_credit_remaining: number;

  plan?: Plan; // présent si ->load('plan') / ->with('plan') côté back
}

// Réponse de GET /subscription/topup
export interface TopupInfo {
  available: boolean;
  sms_count: number;
  price: string | null;
  currency: string;
  credit_remaining: number;
}

// Réponse de POST /subscription/topup/checkout
export interface TopupCheckoutResponse {
  payment_id: number;
  checkout_url: string;
}

// Payload de POST /subscription — réservé aux plans gratuits (ex: Trial).
// Pour un plan payant, utiliser POST /subscription/checkout (paiement FedaPay).
export interface SubscribePayload {
  plan_id: number;
}

// Payload de POST /subscription/checkout — channel/duration_months
// déterminent le prix total, recalculé et vérifié côté serveur.
export interface CheckoutPayload {
  plan_id: number;
  channel: SmsChannel;
  duration_months: 1 | 3 | 6 | 12;
}

export type PaymentStatus = 'pending' | 'approved' | 'declined' | 'canceled' | 'failed';

// Réponse de POST /subscription/checkout
export interface CheckoutResponse {
  // true : plan gratuit, activé immédiatement, `subscription` est renseigné
  // false : plan payant, redirection vers `checkout_url` requise
  free: boolean;
  subscription?: Subscription;
  payment_id?: number;
  checkout_url?: string;
}

// Réponse de GET /subscription/payments/{id}, utilisée pour le polling
// après le retour de FedaPay sur la page de callback.
export interface PaymentStatusResponse {
  id: number;
  status: PaymentStatus;
  plan_id: number;
  subscription: Subscription | null;
}
