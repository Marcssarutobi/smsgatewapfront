import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSmsPricingService } from '../../services/adminSmsPricingService';

export function useSmsPricing() {
  return useQuery({ queryKey: ['sms-pricing'], queryFn: adminSmsPricingService.show });
}

export function useUpdateSmsPricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminSmsPricingService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sms-pricing'] }),
  });
}
