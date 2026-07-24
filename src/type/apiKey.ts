export type ApiKeyEnvironment = 'test' | 'live';
export type ApiKeyStatus = 'active' | 'revoked';

export interface ApiKey {
  id: number;
  user_id: number;
  name: string | null;
  environment: ApiKeyEnvironment;
  key: string; // clé publique, visible
  // 'secret' est $hidden côté modèle -> jamais renvoyé par l'API
  status: ApiKeyStatus;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
}