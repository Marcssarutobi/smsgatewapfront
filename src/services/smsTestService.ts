import { api } from './api';

export interface SendTestSmsPayload {
  apiKey: string;
  to: string;
  message: string;
}

export const smsTestService = {
  send: async ({ apiKey, to, message }: SendTestSmsPayload) => {
    const { data } = await api.post(
      '/v1/sms/send',
      { to, message },
      { headers: { Authorization: `Bearer ${apiKey}` } } // écrase le token Sanctum pour cette requête précise
    );
    return data as { id: number; status: string };
  },
};