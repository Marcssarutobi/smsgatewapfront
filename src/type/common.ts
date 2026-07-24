// Pagination Laravel (ex: GET /users, réservé Admin)
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    links: { url: string | null; label: string; active: boolean }[];
  }
  
  // Erreur de validation Laravel (422)
  export interface ValidationErrorResponse {
    errors: Record<string, string[]>;
  }
  
  // Réponse simple avec message (403, 404, actions de type "supprimé", etc.)
  export interface MessageResponse {
    message: string;
  }