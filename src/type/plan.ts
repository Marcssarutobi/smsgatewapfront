export interface Plan {
    id: number;
    name: string;
    price: string; // decimal(10,2) non casté côté back -> string, ex "5000.00"
    currency: string; // ex "XOF"
    sms_quota_monthly: number;
    max_devices: number;
    // Prix d'un pack de recharge de crédit SMS pour ce plan. null = achat de
    // crédit désactivé pour ce plan (voir Plan::hasTopupAvailable() côté
    // backend). La quantité ajoutée par pack n'est jamais stockée ici : elle
    // se calcule automatiquement à 50% de sms_quota_monthly.
    topup_price: string | null;
    features: string[] | null
    active: boolean;
    created_at: string;
    updated_at: string;
  }