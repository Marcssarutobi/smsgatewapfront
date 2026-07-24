import { webhookService } from "@/src/services/webhookService";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWebhooks() {
    return useQuery({ queryKey: ['webhooks'], queryFn: webhookService.listAllWebhook });
}

export function useCreateWebhook() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: webhookService.createWebHook,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }),
    });
}

export function useToggleWebhook() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: webhookService.toggleDevice,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }),
    });
}

export function useDeleteWebhook() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: webhookService.destroyDevice,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhooks'] }),
    });
}