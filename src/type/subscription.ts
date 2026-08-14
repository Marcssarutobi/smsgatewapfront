import type { Plan } from './plan';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: SubscriptionStatus;
  sms_used: number;
  current_period_start: string; // date (YYYY-MM-DD)
  current_period_end: string;   // date (YYYY-MM-DD)
  created_at: string;
  updated_at: string;

  plan?: Plan; // présent si ->load('plan') / ->with('plan') côté back
}

// Payload de POST /subscription — réservé aux plans gratuits (ex: Trial).
// Pour un plan payant, utiliser POST /subscription/checkout (paiement FedaPay).
export interface SubscribePayload {
  plan_id: number;
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
