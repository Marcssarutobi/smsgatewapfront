import { MessageResponse } from "../type/common";
import { ApiKey, CreateApiKeyResponse } from "../type/apiKey";
import { api } from "./api";

export const apiKeyService = {
    listApiKey: async ():Promise<ApiKey[]>=>{
        const {data} = await api.get('/api-keys')
        return data
    },

    // Le backend génère toujours une paire de clés (test + live) en une seule requête.
    createApiKey: async (name?: string):Promise<CreateApiKeyResponse>=>{
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
