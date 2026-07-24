import { organisationService } from "@/src/services/organisationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetOrganisation(){
    return useQuery({
        queryKey:['organisation'],
        queryFn: ()=>organisationService.show()
    })
}

export function useUpdateOrganisation(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: organisationService.update,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['organisation']})
        }
    })
}