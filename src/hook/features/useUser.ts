import { tokenStorage } from "@/lib/tokenStorage";
import { userService } from "@/services/userService";
import { LoginPayload, RegisterPayload, User } from "@/type/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useMe(){
    return useQuery({
        queryKey: ['me'],
        queryFn: ()=>userService.me(),
        enabled: !!tokenStorage.get(),
    })
}

export function useRegister(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: RegisterPayload)=>userService.register(payload),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['me']})
        }
    })
}

export function useLogin(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload:LoginPayload)=>userService.login(payload),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['me']})
        }
    })
}

export function useLogout(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ()=>userService.logout(),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['me']})
        }
    })
}

export function useUpdateProfile(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: Partial<Pick<User, 'name' | 'email' |'avatar'>>)=>userService.updateProfile(payload),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:['me']})
        }
    })
}

export function useChangePassword() {
    return useMutation({ mutationFn: userService.changePassword });
}

export function useSetupTwoFactor() {
    return useMutation({ mutationFn: userService.setupTwoFactor });
}

export function useConfirmTwoFactor() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: userService.confirmTwoFactor,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
    });
}

export function useVerifyTwoFactor() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: userService.verifyTwoFactor,
      onSuccess: (data) => {
        tokenStorage.set(data.token)
        queryClient.invalidateQueries({ queryKey: ['me'] });
      },
    });
}

export function useAllUser(){
    return useQuery({
        queryKey:['users'],
        queryFn: ()=>userService.allUsers(),
        enabled: !!tokenStorage.get()
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: userService.deleteUser,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });
}