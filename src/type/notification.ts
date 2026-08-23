export interface AppNotification {
  id: string;
  type: string;
  data: {
    title: string;
    body: string;
    url?: string;
  };
  read_at: string | null;
  created_at: string;
}

export interface PaginatedNotifications {
  data: AppNotification[];
  current_page: number;
  last_page: number;
}
