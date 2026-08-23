import { api } from './api';
import { Plan } from '../type/plan';

export interface PlanPayload {
  name: string;
  price: number;
  currency?: string;
  sms_quota_monthly: number;
  max_devices: number;
  active?: boolean;
}

export const adminPlanService = {
  list: async () => {
    const { data } = await api.get<Plan[]>('/plans');
    return data;
  },
  create: async (payload: PlanPayload) => {
    const { data } = await api.post<Plan>('/plans', payload);
    return data;
  },
  update: async ({ id, ...payload }: PlanPayload & { id: number }) => {
    const { data } = await api.put<Plan>(`/plans/${id}`, payload);
    return data;
  },
  deactivate: async (id: number) => {
    const { data } = await api.delete(`/plans/${id}`);
    return data;
  },
};
