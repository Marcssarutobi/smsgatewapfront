import { MessageResponse } from "../type/common";
import { CreateWebhookPayload, Webhook } from "../type/webHook";
import { api } from "./api";

export const webhookService =  {

    listAllWebhook: async ():Promise<Webhook[]>=>{
        const {data} = await api.get('/webhooks')
        return data
    },

    createWebHook: async(payload:CreateWebhookPayload):Promise<Webhook>=>{
        const {data} = await api.post('/webhooks', payload)
        return data
    },

    toggleDevice: (id: number) =>
        api.patch<Webhook>(`/webhooks/${id}/toggle`).then((r) => r.data),

    destroyDevice: (id: number) =>
        api.delete<MessageResponse>(`/webhooks/${id}`).then((r) => r.data),

}