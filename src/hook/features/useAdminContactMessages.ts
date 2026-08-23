import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminContactService } from '../../services/adminContactService';

export function useAdminContactMessages() {
  return useQuery({ queryKey: ['admin', 'contact-messages'], queryFn: adminContactService.list });
}

export function useMarkContactMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminContactService.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] }),
  });
}
