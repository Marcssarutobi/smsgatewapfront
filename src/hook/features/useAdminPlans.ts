import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPlanService } from '../../services/adminPlanService';

export function useAdminPlans() {
  return useQuery({ queryKey: ['admin', 'plans'], queryFn: adminPlanService.list });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminPlanService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminPlanService.update,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });
}

export function useDeactivatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminPlanService.deactivate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });
}
