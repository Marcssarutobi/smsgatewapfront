import { api } from './api';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedContactMessages {
  data: ContactMessage[];
  current_page: number;
  last_page: number;
}

export const adminContactService = {
  list: async () => {
    const { data } = await api.get<PaginatedContactMessages>('/admin/contacts');
    return data;
  },
  markRead: async (id: number) => {
    const { data } = await api.post(`/admin/contacts/${id}/read`);
    return data;
  },
};
