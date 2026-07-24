import { MessageResponse } from "../type/common";
import { ApiKey } from "../types";
import { api } from "./api";

export const apiKeyService = {
    listApiKey: async ():Promise<ApiKey[]>=>{
        const {data} = await api.get('/api-keys')
        return data
    },

    createApiKey: async (name?: string):Promise<ApiKey>=>{
        const {data} = await api.post('/api-keys',{name})
        return data
    },

    revokeApiKey: async (id:number)=>{
        const {data} = await api.patch<MessageResponse>(`/api-keys/${id}/revoke`)
        return data
    },

    destroyApiKey: async(id:number)=>{
        const {data} = await api.delete<MessageResponse>(`/api-keys/${id}`)
        return data
    }
}