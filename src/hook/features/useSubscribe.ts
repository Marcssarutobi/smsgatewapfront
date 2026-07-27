import { subscriptionService } from "@/services/subscriptionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentSubscription() {
    return useQuery({ queryKey: ['subscription'], queryFn: subscriptionService.current });
}
   
export function useCreateSubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionService.subscribe,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription'] }),
    });
}