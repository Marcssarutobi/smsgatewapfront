# 📱 Passerelle SMS Android SaaS — Template Complet React + TailwindCSS + shadcn/ui

Template de site professionnel, complet et moderne pour un **SaaS de gestion d'envois SMS via passerelles mobiles Android**. Ce projet fournit une interface utilisateur moderne (Landing page marketing, Documentation API développeur complète, Espace Administration complet et Authentification).

---

## 🎯 Purpose & Goal

Ce template permet aux entreprises et développeurs de visualiser et proposer une solution SaaS permettant d'expédier des SMS applicatifs (OTP, notifications, alertes) en connectant directement leurs propres téléphones Android équipés de cartes SIM standards avec forfaits illimités, réduisant les coûts d'envoi jusqu'à 90% par rapport aux API SMS traditionnelles (Twilio, Vonage, SMSMode).

---

## 🛠️ Tech Stack & Dependencies

- **Framework** : React 19 + TypeScript + Vite 6
- **Routing** : `react-router-dom` v7
- **Styling** : TailwindCSS v4
- **Composants UI** : Design System inspiré de **shadcn/ui** (Button, Input, Card, Table, Badge, DropdownMenu, Dialog, Tabs, Accordion, Progress, Textarea)
- **Icônes** : `lucide-react`
- **Animations** : `motion` / CSS transitions Tailwind

---

## 🚀 Quick Start — Lancement Local

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application s'ouvre sur `http://localhost:3000`.

3. **Compiler pour la production** :
   ```bash
   npm run build
   ```

---

## 📂 Architecture & Directory Structure

```text
/
├── public/                 # Assets statiques
├── src/
│   ├── components/         # Composants réutilisables (Header, Footer, CodeBlock)
│   │   └── ui/             # Composants shadcn/ui (button, card, dialog, table, badge, etc.)
│   ├── data/               # Données statiques / mock JS (mockData.ts)
│   ├── layouts/            # Layouts réutilisables (MainLayout pour le site public, AdminLayout pour le dashboard)
│   ├── pages/              # Pages publiques (LandingPage, DocsPage, PrivacyPage, ContactPage)
│   │   ├── admin/          # Pages de l'espace administration (Overview, Devices, Logs, API Keys, Webhooks, Org, Sub)
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TwoFactorPage.tsx
│   ├── types.ts            # Interfaces & Déclarations TypeScript
│   ├── App.tsx             # Configuration des routes React Router
│   ├── index.css           # Thème global TailwindCSS
│   └── main.tsx            # Point d'entrée de l'application React
├── metadata.json           # Métadonnées du projet AI Studio
├── package.json            # Dépendances & scripts npm
└── README.md               # Documentation complète
```

---

## 📌 Liste des Pages & Routes Créées

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Vitrine marketing complète : Hero avec schéma interactif, 4 étapes "Comment ça marche", 6 cartes Fonctionnalités, explication économique du SaaS, Grille Tarifaire (Starter/Business/Pro), FAQ Accordion & Footer. |
| `/login` | **Connexion** | Formulaire e-mail/mot de passe + Bouton "Se connecter avec Google". |
| `/register` | **Inscription** | Formulaire de création de compte gratuit 14 jours. |
| `/2fa` | **Double Authentification** | Saisie d'un code de vérification à 6 chiffres. |
| `/admin` | **Dashboard Admin Overview** | 4 cartes de statistiques (SMS envoyés, Taux de livraison, Devices en ligne, Quota), graphique d'activité journalière et tableau des 5 derniers SMS. |
| `/admin/devices` | **Gestion des Téléphones** | Liste des appareils Android (modèle, batterie, SIMs active, statut) + Modale "Ajouter un device" avec **QR Code** et clé d'association. |
| `/admin/sms-logs` | **Historique des SMS** | Journal paginé et filtrable par statut/numéro des SMS expédiés avec bouton d'export CSV. |
| `/admin/api-keys` | **Clés API** | Liste des clés masquées/révélables, statut et modale de génération de nouvelle clé API. |
| `/admin/webhooks` | **Webhooks** | Gestion des callbacks HTTP, secret HMAC SHA-256 et bouton de test de webhook. |
| `/admin/organisation` | **Organisation** | Formulaire d'édition de la raison sociale, adresse, logo et signature SMS. |
| `/admin/abonnement` | **Abonnement** | Suivi du quota SMS mensuel (barre de progression), plan actuel, historique des factures et modale de changement de formule. |
| `/docs` | **Documentation API** | Guide d'intégration complet pour développeurs : Sommaire fixe à gauche, Authentification Bearer, Endpoint POST /v1/sms/send, GET /v1/sms/{id}, Webhooks HMAC et tableau des codes d'erreur HTTP. |
| `/privacy` | **Politique de Confidentialité** | Texte structuré sur les données collectées, le chiffrement et la conformité RGPD. |
| `/contact` | **Page Contact** | Formulaire de contact avec simulation d'envoi réussi et coordonnées directes. |

---

## 🧩 Ajouter un composant shadcn/ui

Si vous souhaitez ajouter un composant supplémentaire de l'écosystème **shadcn/ui** :

```bash
npx shadcn add <component-name>
```
*Exemple* : `npx shadcn add select` ou `npx shadcn add tooltip`.

---

## ⚖️ Note Juridique Importante

> **Avertissement :** Le texte figurant sur la page *Politique de Confidentialité* (`/privacy`) est fourni uniquement à titre d'exemple générique pour la structure du template. Il doit être révisé, adapté et validé par un juriste ou un DPO qualifié avant tout déploiement réel en environnement de production.

---

## 🛠️ Prochaines Étapes pour la Mise en Production

Pour transformer ce template UI en application SaaS fonctionnelle :
1. **Brancher le Backend** : Connecter les formulaires et tableaux aux API REST réelles (ex: Laravel, Express, NestJS).
2. **Gestion de l'Authentification** : Implémenter la gestion de session / JWT ou OAuth2.
3. **Application Android APK** : Développer ou lier le client Android WebSocket qui interagit avec le service de téléphonie `SmsManager`.
4. **Paiement Stripe / Chargify** : Relier le bouton de changement de plan à un portail de facturation en ligne.
