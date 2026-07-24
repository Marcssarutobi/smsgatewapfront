import { apiKeyService } from "@/src/services/apiKeyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllApikey(){
    return useQuery({
        queryKey:['api-keys'],
        queryFn: apiKeyService.listApiKey
    })
}

export function useCreateApiKey(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: apiKeyService.createApiKey,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['api-keys']})
        }
    })
}

export function useRevokeApiKey() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: apiKeyService.revokeApiKey,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
    });
}

export function useDeleteApiKey() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: apiKeyService.destroyApiKey,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
    });
}