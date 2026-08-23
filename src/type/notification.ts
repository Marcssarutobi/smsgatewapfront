export interface AppNotification {
  id: string;
  type: string;
  data: {
    title: string;
    body: string;
    link?: string;
  };
  read_at: string | null;
  created_at: string;
}

export interface PaginatedNotifications {
  data: AppNotification[];
  current_page: number;
  last_page: number;
}

// Forme exacte renvoyée par GET /notifications (voir NotificationController::index) :
// le compteur non-lu est regroupé dans la même réponse, pas un endpoint séparé.
export interface NotificationsResponse {
  unread_count: number;
  notifications: PaginatedNotifications;
}
