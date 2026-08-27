import { api } from './api';

export interface SmsPricingSetting {
  id: number;
  price_per_sms: string; // decimal non casté côté back -> string
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SmsPricingPayload {
  price_per_sms: number;
  currency?: string;
}

export const adminSmsPricingService = {
  show: async () => {
    const { data } = await api.get<SmsPricingSetting>('/sms-pricing');
    return data;
  },
  update: async (payload: SmsPricingPayload) => {
    const { data } = await api.put<SmsPricingSetting>('/admin/sms-pricing', payload);
    return data;
  },
};
