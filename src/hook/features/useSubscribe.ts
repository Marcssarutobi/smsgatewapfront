import { subscriptionService } from "@/services/subscriptionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentSubscription() {
    return useQuery({ queryKey: ['subscription'], queryFn: subscriptionService.current });
}

// Conservé pour les plans gratuits uniquement (voir subscriptionService.subscribe).
export function useCreateSubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionService.subscribe,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription'] }),
    });
}

// Démarre le paiement FedaPay d'un plan (ou l'active directement si gratuit).
export function useCheckoutSubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionService.checkout,
        onSuccess: (data) => {
            // Si le plan était gratuit, l'abonnement est déjà actif : on rafraîchit tout de suite.
            if (data.free) {
                queryClient.invalidateQueries({ queryKey: ['subscription'] });
            }
        },
    });
}

// Utilisé sur la page de callback FedaPay pour attendre la confirmation du paiement.
// enabled=false une fois que le statut n'est plus "pending" (approuvé/refusé/annulé).
export function usePaymentStatus(paymentId: number | null, enabled: boolean) {
    return useQuery({
        queryKey: ['subscription-payment', paymentId],
        queryFn: () => subscriptionService.getPaymentStatus(paymentId as number),
        enabled: enabled && !!paymentId,
        refetchInterval: (query) => (query.state.data?.status === 'pending' ? 2000 : false),
    });
}
