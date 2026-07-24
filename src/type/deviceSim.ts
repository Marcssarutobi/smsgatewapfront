export interface DeviceSim {
    id: number;
    device_id: number;
    slot_index: number; // 0 ou 1
    phone_number: string | null;
    operator: string | null;
    is_active: boolean;
    daily_quota: number;
    sent_today: number;
    signal_strength: number | null;
    created_at: string;
    updated_at: string;
  }