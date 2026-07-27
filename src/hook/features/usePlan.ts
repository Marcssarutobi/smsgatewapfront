import { planService } from "@/services/planService";
import { useQuery } from "@tanstack/react-query";

export function usePlans() {
    return useQuery({ queryKey: ['plans'], queryFn: planService.listPlan });
}