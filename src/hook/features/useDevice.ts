import { deviceService } from "@/src/services/deviceService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllDevice(){
    return useQuery({
        queryKey:['devices'],
        queryFn: deviceService.listAllDevice
    })
}

export function useGetDevice(id: number){
    return useQuery({
        queryKey: ['devices',id],
        queryFn: ()=>deviceService.showDevice(id),
        enabled: !!id,
    })
}

export function useGeneratePairingCode() {
    return useMutation({ 
        mutationFn: deviceService.generatePairingCode 
    });
}

export function useRenameDevice() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, name }: { id: number; name: string }) =>
        deviceService.renameDevice(id, name),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
    });
}

export function useDeleteDevice() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deviceService.destroyDevice,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devices'] }),
    });
}