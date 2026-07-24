import type { Organisation } from './organisation';
import type { Subscription } from './subscription';

export type UserRole = 'Admin' | 'Client';
export type UserStatus = 'actif' | 'suspendu' | 'en_attente';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  two_factor_confirmed_at: string | null; // présence = 2FA activée
  status: UserStatus;
  role: UserRole;
  created_at: string;
  updated_at: string;

  // Relations optionnelles : présentes seulement si le back a fait ->load(...)
  // (cas de GET /me : load('organisation', 'activeSubscription.plan'))
  organisation?: Organisation | null;
  activeSubscription?: Subscription | null;
}

// Payloads liés à l'auth (pas une table, mais pratique à côté de User)
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginTwoFactorPendingResponse {
  requires_2fa: true;
  temp_token: string;
}