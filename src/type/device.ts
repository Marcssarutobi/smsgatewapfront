import type { DeviceSim } from './deviceSim';

export type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: number;
  user_id: number;
  name: string;
  // 'device_token' et 'fcm_token' sont $hidden -> jamais renvoyés par l'API
  android_device_id: string | null;
  status: DeviceStatus;
  battery_level: number | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;

  sims?: DeviceSim[]; // présent si relation chargée
}