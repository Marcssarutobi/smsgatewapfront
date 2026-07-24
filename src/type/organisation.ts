export interface Organisation {
    id: number;
    user_id: number;
    name: string;
    signature: string | null; // ajoutée en fin de SMS
    logo: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
  }