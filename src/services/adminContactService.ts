import { api } from './api';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface PaginatedContactMessages {
  data: ContactMessage[];
  current_page: number;
  last_page: number;
}

export const adminContactService = {
  list: async () => {
    const { data } = await api.get<PaginatedContactMessages>('/admin/contact-messages');
    return data;
  },
  markRead: async (id: number) => {
    const { data } = await api.post(`/admin/contact-messages/${id}/read`);
    return data;
  },
};
