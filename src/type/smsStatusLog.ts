export interface SmsStatusLog {
    id: number;
    sms_message_id: number;
    status: string; // pending | queued | sent | delivered | failed (string libre côté DB)
    details: string | null;
    created_at: string;
    // pas de updated_at : $timestamps = false sur ce modèle
  }