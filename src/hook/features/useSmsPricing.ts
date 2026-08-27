import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smsPricingService } from '../../services/smsPricingService';

export function useSmsPricing() {
  return useQuery({ queryKey: ['sms-pricing'], queryFn: smsPricingService.get });
}

export function useUpdateSmsPricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: smsPricingService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sms-pricing'] }),
  });
}
