import { SmsStatusLog } from "@/type/smsStatusLog";
import { SendSmsPayload, SendSmsResponse, SmsMessage, SmsStatus } from "../type/smsMessage";
import { api } from "./api";

export const smsMessageService = {

    send: (apiKey: string, payload: SendSmsPayload) =>
        api
          .post<SendSmsResponse>('/v1/sms/send', payload, {
            headers: { Authorization: `Bearer ${apiKey}` },
          })
          .then((r) => r.data),

    show: (apiKey: string, id: number) =>
        api
            .get<SmsMessage>(`/v1/sms/${id}`, {
                headers: { Authorization: `Bearer ${apiKey}` },
            })
            .then((r) => r.data),

    list: (apiKey: string,status?: SmsStatus)=>{
        return api.get<SmsMessage>('/v1/sms', {
            headers: { Authorization: `Bearer ${apiKey}` },
            params: { status },
        })
        .then((r) => r.data)
    },

    getHistory: async(status?: string):Promise<SmsStatusLog[]>=>{
        const {data} = await api.get('/sms-logs',{
            params: status ? { status } : {},
        })
        return data
    }

}