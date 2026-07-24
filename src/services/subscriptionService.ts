import { SubscribePayload, Subscription } from "../type/subscription";
import { api } from "./api";

export const subscriptionService = {
    current: () => api.get<Subscription>('/subscription').then((r) => r.data),
   
    subscribe: (payload: SubscribePayload) =>
      api.post<Subscription>('/subscription', payload).then((r) => r.data),
};