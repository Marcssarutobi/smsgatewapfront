export interface OauthAccount {
    id: number;
    user_id: number;
    provider: string; // 'google'
    provider_id: string;
    // castés 'encrypted' côté back mais pas hidden : présents si la relation est chargée
    access_token: string | null;
    refresh_token: string | null;
    created_at: string;
    updated_at: string;
  }