import { api } from './api';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  send: async (payload: ContactPayload) => {
    const { data } = await api.post<{ message: string }>('/contact', payload);
    return data;
  },
};
