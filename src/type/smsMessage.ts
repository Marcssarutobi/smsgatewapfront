import type { SmsStatusLog } from './smsStatusLog';
import type { Device } from './device';
import type { DeviceSim } from './deviceSim';

export type SmsStatus = 'pending' | 'queued' | 'sent' | 'delivered' | 'failed';

export interface SmsMessage {
  id: number;
  user_id: number;
  api_key_id: number;
  device_sim_id: number | null;
  recipient: string;
  content: string;
  status: SmsStatus;
  priority: number;
  cost: string; // decimal(8,2) non casté côté back -> string, ex "0.00"
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;

  statusLogs?: SmsStatusLog[]; // si relation chargée
  // Relation chargée par indexForUser()/showForUser() : ->with('deviceSim.device').
  // Laravel snake-case le nom de la relation en JSON -> "device_sim".
  device_sim?: (DeviceSim & { device?: Device }) | null;
}

// Payload d'envoi (POST /v1/sms/send, auth par clé API)
// Attention : le contrôleur valide 'to' et 'message', pas 'recipient'/'content'
// (ces derniers sont les noms des colonnes en base, remplis à partir de 'to'/'message')
export interface SendSmsPayload {
  to: string;
  message: string;
}

// Réponse du store() : pas le SmsMessage complet, juste id + status
export interface SendSmsResponse {
  id: number;
  status: SmsStatus;
}