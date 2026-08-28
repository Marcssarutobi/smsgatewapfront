import {
  CheckoutPayload,
  CheckoutResponse,
  PaymentStatusResponse,
  SubscribePayload,
  Subscription,
  TopupCheckoutResponse,
  TopupInfo,
} from "../type/subscription";
import { api } from "./api";

export const subscriptionService = {
  current: () => api.get<Subscription>('/subscription').then((r) => r.data),

  // Réservé aux plans gratuits (ex: Trial). Pour un plan payant,
  // le backend renvoie une erreur 422 invitant à utiliser checkout().
  subscribe: (payload: SubscribePayload) =>
    api.post<Subscription>('/subscription', payload).then((r) => r.data),

  // Démarre le paiement d'un plan (FedaPay) — ou l'active immédiatement si gratuit.
  // channel + duration_months déterminent le prix total, recalculé côté serveur.
  checkout: (payload: CheckoutPayload) =>
    api.post<CheckoutResponse>('/subscription/checkout', payload).then((r) => r.data),

  // Polling du statut d'un paiement en cours, utilisé sur la page de callback
  // après le retour de FedaPay (en complément du webhook, qui reste la source de vérité).
  getPaymentStatus: (paymentId: number) =>
    api.get<PaymentStatusResponse>(`/subscription/payments/${paymentId}`).then((r) => r.data),

  // Achat de crédit SMS supplémentaire sur l'abonnement actif (même flux
  // FedaPay que checkout(), mais n'ajoute que du crédit, sans nouvelle période).
  getTopupInfo: () => api.get<TopupInfo>('/subscription/topup').then((r) => r.data),

  checkoutTopup: () =>
    api.post<TopupCheckoutResponse>('/subscription/topup/checkout').then((r) => r.data),
};
