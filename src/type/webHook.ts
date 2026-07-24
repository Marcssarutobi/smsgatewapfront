export type WebhookEvent = 'sms.sent' | 'sms.delivered' | 'sms.failed';

export interface Webhook {
  id: number;
  user_id: number;
  url: string;
  event: WebhookEvent;
  // 'secret' est $hidden -> jamais renvoyé par l'API
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookPayload {
  url: string;
  event: WebhookEvent;
}