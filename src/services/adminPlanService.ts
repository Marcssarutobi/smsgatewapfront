import { api } from './api';
import { Plan } from '../type/plan';

export interface PlanPayload {
  name: string;
  price: number;
  currency?: string;
  sms_quota_monthly: number;
  max_devices: number;
  // null = pas de pack de recharge proposé pour ce plan. Omettre le champ
  // (undefined) laisse la valeur actuelle inchangée côté backend (validation
  // 'sometimes') ; envoyer explicitement null la réinitialise.
  topup_price?: number | null;
  active?: boolean;
}

export const adminPlanService = {
  list: async () => {
    const { data } = await api.get<Plan[]>('/admin/plans');
    return data;
  },
  create: async (payload: PlanPayload) => {
    const { data } = await api.post<Plan>('/admin/plans', payload);
    return data;
  },
  update: async ({ id, ...payload }: PlanPayload & { id: number }) => {
    const { data } = await api.put<Plan>(`/admin/plans/${id}`, payload);
    return data;
  },
  deactivate: async (id: number) => {
    const { data } = await api.delete(`/admin/plans/${id}`);
    return data;
  },
};
