import { api } from './api';

export interface SmsPricing {
  id: number;
  price_per_sms: string; // decimal non casté côté back -> string
  currency: string;
  created_at: string;
  updated_at: string;
}

export const smsPricingService = {
  // Route publique — nécessaire pour calculer le prix "mode Réseau" en
  // direct sur la page de souscription, avant même que l'utilisateur soit connecté.
  get: () => api.get<SmsPricing>('/sms-pricing').then((r) => r.data),

  // Staff uniquement (voir routes/api.php, middleware 'admin').
  update: (price_per_sms: number) =>
    api.put<SmsPricing>('/admin/sms-pricing', { price_per_sms }).then((r) => r.data),
};
