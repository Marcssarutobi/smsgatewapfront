import { MessageResponse } from '../type/common'
import { AuthResponse, LoginPayload, LoginTwoFactorPendingResponse, RegisterPayload, User } from '../type/user'
import {api, webApi} from './api'
import { tokenStorage } from '@/lib/tokenStorage';



export const userService = {


    googleRedirect: async () => {
        const { data } = await webApi.get<{ url: string }>('/auth/google/redirect')
        return data
    },
    
    googleCallback: async (code: string) => {
        const { data } = await webApi.get<AuthResponse | LoginTwoFactorPendingResponse>('/auth/google/callback', {
            params: { code }
        })
        return data
    },

    register: async(payload:RegisterPayload)=>{
        const {data} = await api.post<AuthResponse>('/auth/register',payload)
        return data
    },

    login: async(payload:LoginPayload)=>{
        const {data} = await api.post<AuthResponse | LoginTwoFactorPendingResponse>('/auth/login',payload)
        
        // Si la 2FA n'est pas requise, on a un vrai token final -> on le stocke
        if ('token' in data) {
            tokenStorage.set(data.token)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }

        return data
    },

    logout: async()=>{
        const {data} = await api.post<MessageResponse>('/auth/logout')
        return data
    },

    me: async()=>{
        const {data} = await api.get<User>('/auth/me')
        return data
    },

    updateProfile: async (payload: Partial<Pick<User, 'name' | 'email' |'avatar'>>)=>{
        const {data} = await api.put<{user: User}>('/auth/profile',payload)
        return data
    },

    changePassword: async(payload:{current_password: string;new_password: string;new_password_confirmation: string;})=>{
        const {data} = await api.put<MessageResponse>('/auth/profile/password',payload)
        return data
    },

    setupTwoFactor: async ()=>{
        const {data} = await api.post<{secret: string; qr_code_svg: string}>('/auth/2fa/setup')
        return data
    },

    confirmTwoFactor: async (code: string)=>{
        const {data} = await api.post<{ recovery_codes: string[] }>('/auth/2fa/confirm', { code })
        return data
    },

    disableTwoFactor: async (password: string)=>{
        const {data} = await api.post<MessageResponse>('/auth/2fa/disable', { password })
        return data
    },

    resendVerificationEmail: async ()=>{
        const {data} = await api.post<MessageResponse>('/auth/email/resend')
        return data
    },

    forgotPassword: async (email: string)=>{
        const {data} = await api.post<MessageResponse>('/auth/forgot-password', { email })
        return data
    },

    resetPassword: async (payload: { token: string; email: string; password: string; password_confirmation: string })=>{
        const {data} = await api.post<MessageResponse>('/auth/reset-password', payload)
        return data
    },

    allUsers: async():Promise<User[]>=>{
        const {data} = await api.get('/users')
        return data
    },

    // À appeler avec le temp_token reçu au login (ability 2fa-pending)
    verifyTwoFactor: async (code: string) =>{
        const {data} = await api.post<AuthResponse>('/auth/2fa/verify', { code })
        return data
    },

    deleteUser : async(id: number)=>{
        const {data} = await api.delete<MessageResponse>(`/users/${id}`)
        return data
    }

}