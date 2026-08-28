export interface Organisation {
    id: number;
    user_id: number;
    name: string;
    signature: string | null; // ajoutée en fin de SMS
    logo: string | null;
    website: string | null;
    phone: string | null;
    address: string | null;
    // Propres au mode Réseau (MTN) : sans effet tant que preferred_sms_channel
    // n'est pas "network" (voir MtnSmsService::forOrganisation côté backend).
    mtn_sender_address: string | null;
    mtn_country_code: string;
    // Synchronisé automatiquement à l'activation d'un abonnement (voir
    // PaymentController::activateSubscription) — informatif uniquement ici,
    // se change en souscrivant un nouveau plan avec un canal différent, pas
    // depuis ce formulaire.
    preferred_sms_channel: 'device' | 'network';
    created_at: string;
    updated_at: string;
  }