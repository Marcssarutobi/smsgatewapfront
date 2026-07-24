import { AndroidDevice, SmsLog, ApiKey, Webhook, OrganisationInfo, SubscriptionPlan, FaqItem } from '../types';

export const MOCK_DEVICES: AndroidDevice[] = [
  {
    id: 'dev_01',
    name: 'Samsung Galaxy A54 (Passerelle #1)',
    model: 'SM-A546B',
    androidVersion: 'Android 14 (OneUI 6.0)',
    batteryLevel: 98,
    isPluggedIn: true,
    status: 'online',
    lastSeen: 'Il y a 10 secondes',
    sims: [
      { slot: 1, carrier: 'Orange France', phoneNumber: '+33 6 12 34 56 78', signalStrength: 92, status: 'active' },
      { slot: 2, carrier: 'Bouygues Telecom', phoneNumber: '+33 6 98 76 54 32', signalStrength: 85, status: 'active' }
    ],
    smsSentToday: 412,
    smsLimitDaily: 1000
  },
  {
    id: 'dev_02',
    name: 'Xiaomi Redmi Note 13 (Passerelle #2)',
    model: '2312DRA50G',
    androidVersion: 'Android 13 (HyperOS)',
    batteryLevel: 84,
    isPluggedIn: true,
    status: 'online',
    lastSeen: 'Il y a 45 secondes',
    sims: [
      { slot: 1, carrier: 'Free Mobile', phoneNumber: '+33 7 45 12 89 00', signalStrength: 78, status: 'active' }
    ],
    smsSentToday: 289,
    smsLimitDaily: 800
  },
  {
    id: 'dev_03',
    name: 'Google Pixel 7a (Passerelle #3 - secours)',
    model: 'GWKK3',
    androidVersion: 'Android 14 (Stock)',
    batteryLevel: 100,
    isPluggedIn: true,
    status: 'online',
    lastSeen: 'Il y a 2 minutes',
    sims: [
      { slot: 1, carrier: 'SFR France', phoneNumber: '+33 6 55 44 33 22', signalStrength: 95, status: 'active' }
    ],
    smsSentToday: 115,
    smsLimitDaily: 1000
  },
  {
    id: 'dev_04',
    name: 'Samsung Galaxy S21 Ultra (Passerelle #4)',
    model: 'SM-G998B',
    androidVersion: 'Android 14',
    batteryLevel: 15,
    isPluggedIn: false,
    status: 'busy',
    lastSeen: 'Il y a 5 minutes',
    sims: [
      { slot: 1, carrier: 'Orange France', phoneNumber: '+33 6 11 22 33 44', signalStrength: 60, status: 'active' }
    ],
    smsSentToday: 650,
    smsLimitDaily: 1000
  },
  {
    id: 'dev_05',
    name: 'Motorola Moto G84 (Agence Lyon)',
    model: 'XT2345-2',
    androidVersion: 'Android 13',
    batteryLevel: 0,
    isPluggedIn: false,
    status: 'offline',
    lastSeen: 'Il y a 3 heures',
    sims: [
      { slot: 1, carrier: 'Free Mobile', phoneNumber: '+33 7 99 88 77 66', signalStrength: 0, status: 'inactive' }
    ],
    smsSentToday: 0,
    smsLimitDaily: 500
  }
];

export const MOCK_SMS_LOGS: SmsLog[] = [
  {
    id: 'msg_98412',
    recipient: '+33 6 42 18 90 23',
    message: 'Votre code de vérification SMS-Gateway est : 849201. Valide pendant 10 minutes.',
    deviceId: 'dev_01',
    deviceName: 'Samsung Galaxy A54',
    simSlot: 1,
    carrier: 'Orange France',
    status: 'delivered',
    createdAt: '2026-07-21 11:42:10',
    deliveredAt: '2026-07-21 11:42:13',
    cost: 0
  },
  {
    id: 'msg_98411',
    recipient: '+33 7 81 02 44 19',
    message: 'Rappel rdv : Votre consultation avec le Dr Martin est confirmée pour demain à 14h30.',
    deviceId: 'dev_01',
    deviceName: 'Samsung Galaxy A54',
    simSlot: 2,
    carrier: 'Bouygues Telecom',
    status: 'delivered',
    createdAt: '2026-07-21 11:39:05',
    deliveredAt: '2026-07-21 11:39:08',
    cost: 0
  },
  {
    id: 'msg_98410',
    recipient: '+33 6 19 88 34 50',
    message: 'Votre commande #48291 a été expédiée via Colissimo. Suivi : 8X00921849.',
    deviceId: 'dev_02',
    deviceName: 'Xiaomi Redmi Note 13',
    simSlot: 1,
    carrier: 'Free Mobile',
    status: 'delivered',
    createdAt: '2026-07-21 11:30:22',
    deliveredAt: '2026-07-21 11:30:26',
    cost: 0
  },
  {
    id: 'msg_98409',
    recipient: '+33 6 92 11 00 77',
    message: 'Alerte sécurité : Une nouvelle connexion à votre compte SaaS a été détectée depuis Paris.',
    deviceId: 'dev_03',
    deviceName: 'Google Pixel 7a',
    simSlot: 1,
    carrier: 'SFR France',
    status: 'sent',
    createdAt: '2026-07-21 11:25:00',
    deliveredAt: '2026-07-21 11:25:04',
    cost: 0
  },
  {
    id: 'msg_98408',
    recipient: '+33 7 50 12 34 56',
    message: 'Flash Info : Votre facture de Juillet est disponible dans votre espace client.',
    deviceId: 'dev_02',
    deviceName: 'Xiaomi Redmi Note 13',
    simSlot: 1,
    carrier: 'Free Mobile',
    status: 'queued',
    createdAt: '2026-07-21 11:24:12',
    cost: 0
  },
  {
    id: 'msg_98407',
    recipient: '+33 6 00 11 22 33',
    message: 'Offre exclusive : Profitez de -20% sur tout le catalogue jusqu’à ce soir minuit.',
    deviceId: 'dev_04',
    deviceName: 'Samsung Galaxy S21',
    simSlot: 1,
    carrier: 'Orange France',
    status: 'failed',
    createdAt: '2026-07-21 10:55:00',
    errorMessage: 'Numéro destinataire invalide ou rejeté par l’opérateur',
    cost: 0
  },
  {
    id: 'msg_98406',
    recipient: '+33 6 33 44 55 66',
    message: 'Confirmation d’inscription : Bienvenue sur la plateforme TechPro !',
    deviceId: 'dev_01',
    deviceName: 'Samsung Galaxy A54',
    simSlot: 1,
    carrier: 'Orange France',
    status: 'delivered',
    createdAt: '2026-07-21 10:15:30',
    deliveredAt: '2026-07-21 10:15:33',
    cost: 0
  },
  {
    id: 'msg_98405',
    recipient: '+33 7 11 99 88 77',
    message: 'Rappel : La réunion d’équipe débutera à 15h00 en salle Visioconférence B.',
    deviceId: 'dev_03',
    deviceName: 'Google Pixel 7a',
    simSlot: 1,
    carrier: 'SFR France',
    status: 'delivered',
    createdAt: '2026-07-21 09:40:12',
    deliveredAt: '2026-07-21 09:40:15',
    cost: 0
  }
];

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key_01',
    name: 'Production Server - API Principal',
    prefix: 'sk_live_prod',
    keyMasked: 'sk_live_prod_9f82••••••••••••3a1c',
    fullKey: 'sk_live_prod_9f82a19x84b2c0193a1c',
    status: 'active',
    createdAt: '2026-01-15',
    lastUsedAt: 'Aujourd’hui à 11:42',
    permissions: ['sms.send', 'sms.read', 'devices.read']
  },
  {
    id: 'key_02',
    name: 'Environnement Staging / Test',
    prefix: 'sk_test_dev',
    keyMasked: 'sk_test_dev_1a2b••••••••••••8f9e',
    fullKey: 'sk_test_dev_1a2b3c4d5e6f7g8h8f9e',
    status: 'active',
    createdAt: '2026-03-02',
    lastUsedAt: 'Hier à 18:30',
    permissions: ['sms.send', 'sms.read']
  },
  {
    id: 'key_03',
    name: 'Ancienne Clé Zapier (Révoquée)',
    prefix: 'sk_live_old',
    keyMasked: 'sk_live_old_0000••••••••••••0000',
    status: 'revoked',
    createdAt: '2025-11-10',
    lastUsedAt: 'Il y a 45 jours',
    permissions: ['sms.send']
  }
];

export const MOCK_WEBHOOKS: Webhook[] = [
  {
    id: 'wh_01',
    url: 'https://api.votreapp.com/webhooks/sms-status',
    events: ['sms.delivered', 'sms.failed', 'sms.queued'],
    status: 'active',
    secret: 'whsec_99a8b7c6d5e4f3a210',
    createdAt: '2026-02-10',
    lastDeliveryStatus: '200 OK',
    lastTriggeredAt: 'Il y a 3 minutes'
  },
  {
    id: 'wh_02',
    url: 'https://hooks.zapier.com/hooks/catch/123456/sms-gateway',
    events: ['device.offline', 'device.battery_low'],
    status: 'active',
    secret: 'whsec_771122334455667788',
    createdAt: '2026-04-18',
    lastDeliveryStatus: '200 OK',
    lastTriggeredAt: 'Il y a 3 heures'
  },
  {
    id: 'wh_03',
    url: 'https://staging.votreapp.com/callback',
    events: ['sms.delivered'],
    status: 'paused',
    secret: 'whsec_000000000000000000',
    createdAt: '2026-05-01',
    lastDeliveryStatus: '500 Error',
    lastTriggeredAt: 'Il y a 2 jours'
  }
];

export const MOCK_ORGANISATION: OrganisationInfo = {
  name: 'Acme Technologies SAS',
  email: 'admin@acme-tech.fr',
  phone: '+33 1 40 50 60 70',
  address: '42 Avenue des Champs-Élysées, 75008 Paris, France',
  smsSignature: 'Envoyé via Acme SMS',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  timezone: 'Europe/Paris (UTC+01:00)',
  webhookSecret: 'whsec_acme_master_key_9988'
};

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    tagline: 'Ideal pour les indépendants et petites startups qui débutent.',
    priceMonthly: 29,
    priceYearly: 24,
    smsQuotaMonthly: 2500,
    maxDevices: 2,
    features: [
      '2,500 SMS / mois inclus',
      'Jusqu’à 2 téléphones Android connectés',
      'API REST complète v1',
      'Support des cartes Dual-SIM',
      'Webhooks en temps réel',
      'Rapports d’envoi basiques',
      'Support par e-mail sous 24h'
    ]
  },
  {
    id: 'plan_business',
    name: 'Business',
    tagline: 'Pour les PME, e-commerces et services SaaS à fort volume.',
    priceMonthly: 79,
    priceYearly: 65,
    smsQuotaMonthly: 20000,
    maxDevices: 10,
    isPopular: true,
    features: [
      '20,000 SMS / mois inclus',
      'Jusqu’à 10 téléphones Android connectés',
      'Bascule automatique Multi-SIM & Fallback',
      'Webhooks avec retry automatique',
      'Gestionnaire multi-clés API & Rôles',
      'Télémétrie batterie & signal SIM en direct',
      'Support prioritaire 7j/7',
      'Garantie de service Uptime 99.9%'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Pro Enterprise',
    tagline: 'Infrastructures critiques, centres de santé et fintechs.',
    priceMonthly: 199,
    priceYearly: 169,
    smsQuotaMonthly: 100000,
    maxDevices: 50,
    features: [
      '100,000+ SMS / mois inclus',
      'Jusqu’à 50 téléphones Android connectés',
      'Passerelles dédiées & IP isolées',
      'Rate limiting sur-mesure & failover instantané',
      'Contrat SLA 99.99% garanti',
      'Chiffrement de bout en bout optionnel',
      'Account Manager dédié & Support téléphonique',
      'Intégration sur-mesure & accompagnement dev'
    ]
  }
];

export const MOCK_FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'Comment fonctionne concrètement la passerelle SMS Android ?',
    answer: 'Notre service repose sur une application Android ultra-légère installée sur vos téléphones. Cette application établit une connexion sécurisée par WebSockets avec nos serveurs cloud. Lorsque vous faites un appel à notre API REST, le message est transmis instantanément au téléphone le plus disponible, qui expédie le SMS via sa carte SIM standard.'
  },
  {
    id: 'faq_2',
    question: 'Pourquoi utiliser ses propres téléphones plutôt qu’une API SMS classique (Twilio, SMSMode) ?',
    answer: 'Les fournisseurs d’API SMS traditionnels appliquent des surcoûts importants par message (souvent 0.04€ à 0.08€ / SMS). En utilisant vos propres forfaits mobiles avec SMS illimités (Free, Orange, Bouygues, SFR), vos coûts d’envoi chutent drastiquement. Vous ne payez que l’infrastructure SaaS de routage et de gestion.'
  },
  {
    id: 'faq_3',
    question: 'Est-ce légal d’envoyer des SMS applicatifs depuis un forfait mobile commercial ?',
    answer: 'Oui, à condition d’utiliser des numéros dédiés et d’accorder vos envois avec les Conditions Générales de Vente de votre opérateur (respect des quotas d’envoi par minute et absence de spam). Notre plateforme inclut un système intelligent de répartition de charge pour lisser l’envoi des SMS et éviter tout blocage opérateur.'
  },
  {
    id: 'faq_4',
    question: 'Combien de téléphones Android puis-je connecter à mon compte ?',
    answer: 'Cela dépend de votre plan d’abonnement : 2 téléphones pour la formule Starter, 10 pour Business et jusqu’à 50 (ou plus sur-mesure) pour le plan Pro Enterprise. Vous pouvez combiner plusieurs téléphones de différents opérateurs pour une redondance maximale.'
  },
  {
    id: 'faq_5',
    question: 'Que se passe-t-il si un téléphone n’a plus de batterie ou perd le réseau ?',
    answer: 'Notre plateforme monitore en temps réel l’état du réseau, la batterie et la disponibilité de chaque appareil. Si un appareil devient indisponible, notre routeur intelligent bascule automatiquement le SMS vers un autre téléphone connecté actif (failover instantané) ou le place en file d’attente sécurisée.'
  },
  {
    id: 'faq_6',
    question: 'Puis-je utiliser un téléphone Dual-SIM pour envoyer avec deux opérateurs différents ?',
    answer: 'Absolument ! Notre passerelle gère nativement le Dual-SIM sur Android. Dans vos requêtes API, vous pouvez spécifier explicitement quel emplacement de carte SIM (`sim_slot: 1` ou `sim_slot: 2`) utiliser pour acheminer vos messages.'
  }
];
