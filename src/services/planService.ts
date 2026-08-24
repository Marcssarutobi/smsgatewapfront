import { Plan } from "../type/plan";
import { api } from "./api";

export const planService = {
    // Route publique, pas d'auth nécessaire (page tarifs)
    listPlan: () => api.get<Plan[]>('/admin/plans').then((r) => r.data),
};