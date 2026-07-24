import React, { useState } from 'react';
import {
  Code2,
  KeyRound,
  Send,
  Search,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Terminal
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { CodeBlock } from '../components/CodeBlock';

const DOC_SECTIONS = [
  { id: 'intro', label: '1. Introduction & Présentation' },
  { id: 'auth', label: '2. Authentification API' },
  { id: 'send-sms', label: '3. Envoyer un SMS' },
  { id: 'check-status', label: '4. Vérifier le Statut' },
  { id: 'webhooks', label: '5. Webhooks & Callbacks' },
  { id: 'error-codes', label: '6. Codes d’Erreur & HTTP' },
];

export function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sticky Left Table of Contents */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <span>Sommaire Documentation</span>
            </div>
            <nav className="space-y-1 text-xs font-medium">
              {DOC_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{sec.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Besoin d’aide ?{' '}
              <a href="/contact" className="text-indigo-600 font-semibold hover:underline">
                Contacter le support dev
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content Right Column */}
        <main className="lg:col-span-9 space-y-16">
          {/* Header intro banner */}
          <div className="space-y-3 border-b border-slate-200 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
              <Terminal className="h-3.5 w-3.5 text-indigo-600" />
              <span>Documentation Technique API v1.0</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Spécifications de l'API REST SMS Gateway
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
              Intégrez l’envoi automatique de SMS depuis votre infrastructure vers vos téléphones Android en quelques minutes.
            </p>
          </div>

          {/* SECTION 1 : Introduction */}
          <section id="intro" className="scroll-m-24 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                1
              </span>
              Introduction
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              L’API REST <strong>SMS Gateway</strong> vous permet d’expédier, de planifier et de suivre la livraison de vos SMS en vous appuyant directement sur la connexion cellulaire de vos propres téléphones mobiles Android. Notre plateforme prend en charge le routage sécurisé, la répartition de charge, le basculement Dual-SIM et les retours d'état par Webhook.
            </p>
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-900 space-y-1">
              <p className="font-bold">Base URL de l’API Production :</p>
              <code className="bg-white px-2 py-1 rounded font-mono text-indigo-700 border border-indigo-200 inline-block font-semibold">
                https://api.smspasserelle.io/v1
              </code>
            </div>
          </section>

          {/* SECTION 2 : Authentification */}
          <section id="auth" className="scroll-m-24 space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                2
              </span>
              Authentification
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Toutes les requêtes faites envers l'API doivent inclure votre clé API secrète dans le header HTTP <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">Authorization</code> sous la forme d'un jeton Bearer.
            </p>

            <CodeBlock
              title="Header HTTP d'authentification"
              language="http"
              code={`Authorization: Bearer sk_live_prod_9f82a19x84b2c0193a1c\nContent-Type: application/json`}
            />
          </section>

          {/* SECTION 3 : Envoyer un SMS */}
          <section id="send-sms" className="scroll-m-24 space-y-6 pt-6 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                  3
                </span>
                <Badge className="bg-emerald-600 text-white font-mono uppercase font-bold text-xs">POST</Badge>
                <code className="text-base font-bold text-slate-900 font-mono">/v1/sms/send</code>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Envoyer un SMS</h2>
              <p className="text-slate-600 text-sm mt-1">Achemine un SMS vers le téléphone connecté disponible.</p>
            </div>

            {/* Table of parameters */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Paramètres de la requête (JSON Body)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Champ</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Requis</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono font-bold text-xs text-indigo-600">to</TableCell>
                    <TableCell className="font-mono text-xs">string</TableCell>
                    <TableCell><Badge variant="destructive" className="text-[10px]">Oui</Badge></TableCell>
                    <TableCell className="text-xs text-slate-600">Numéro destinataire au format international E.164 (ex: +33612345678)</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-mono font-bold text-xs text-indigo-600">message</TableCell>
                    <TableCell className="font-mono text-xs">string</TableCell>
                    <TableCell><Badge variant="destructive" className="text-[10px]">Oui</Badge></TableCell>
                    <TableCell className="text-xs text-slate-600">Texte du SMS à expédier (supporte l'encodage UTF-8 et emojis)</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-mono font-bold text-xs text-indigo-600">device_id</TableCell>
                    <TableCell className="font-mono text-xs">string</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">Optionnel</Badge></TableCell>
                    <TableCell className="text-xs text-slate-600">ID d'un téléphone spécifique (ex: dev_01). Si omis, la passerelle choisit l'appareil le plus disponible.</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-mono font-bold text-xs text-indigo-600">sim_slot</TableCell>
                    <TableCell className="font-mono text-xs">integer</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">Optionnel</Badge></TableCell>
                    <TableCell className="text-xs text-slate-600">Emplacement SIM à utiliser pour les téléphones Dual-SIM (1 ou 2)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Code Examples */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Exemple cURL</h3>
              <CodeBlock
                language="bash"
                title="cURL Request"
                code={`curl -X POST "https://api.smspasserelle.io/v1/sms/send" \\
  -H "Authorization: Bearer sk_live_prod_9f82a19x84b2c0193a1c" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+33612345678",
    "message": "Votre code de vérification SMS-Gateway est : 849201",
    "sim_slot": 1
  }'`}
              />

              <h3 className="text-sm font-bold text-slate-900">Exemple JavaScript (fetch)</h3>
              <CodeBlock
                language="javascript"
                title="Node.js / Browser Fetch"
                code={`const response = await fetch('https://api.smspasserelle.io/v1/sms/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_prod_9f82a19x84b2c0193a1c',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+33612345678',
    message: 'Votre commande #48291 a été expédiée via Colissimo.'
  })
});

const data = await response.json();
console.log(data);`}
              />

              <h3 className="text-sm font-bold text-slate-900">Exemple de Réponse Succès (JSON 200 OK)</h3>
              <CodeBlock
                language="json"
                title="Response 200 OK"
                code={`{
  "success": true,
  "data": {
    "sms_id": "msg_98412",
    "status": "queued",
    "recipient": "+33612345678",
    "assigned_device": {
      "id": "dev_01",
      "name": "Samsung Galaxy A54",
      "carrier": "Orange France",
      "sim_slot": 1
    },
    "created_at": "2026-07-21T11:42:10Z"
  }
}`}
              />
            </div>
          </section>

          {/* SECTION 4 : Vérifier le statut d'un SMS */}
          <section id="check-status" className="scroll-m-24 space-y-6 pt-6 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                  4
                </span>
                <Badge className="bg-blue-600 text-white font-mono uppercase font-bold text-xs">GET</Badge>
                <code className="text-base font-bold text-slate-900 font-mono">/v1/sms/{"{sms_id}"}</code>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Vérifier le statut d'un SMS</h2>
              <p className="text-slate-600 text-sm mt-1">Interrogez l'état en temps réel d'un message spécifique.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Liste des statuts possibles :</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <Badge variant="warning" className="font-semibold">pending / queued</Badge>
                  <p className="text-slate-600">SMS placé en file d'attente sur les serveurs ou en cours de transmission vers le téléphone Android.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <Badge variant="default">sent</Badge>
                  <p className="text-slate-600">SMS expédié avec succès par la carte SIM du téléphone vers le réseau GSM opérateur.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <Badge variant="success">delivered</Badge>
                  <p className="text-slate-600">Accusé de réception de livraison confirmé par le destinataire final.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <Badge variant="destructive">failed</Badge>
                  <p className="text-slate-600">Échec d'envoi (numéro invalide, rejet opérateur ou absence de réseau GSM).</p>
                </div>
              </div>
            </div>

            <CodeBlock
              language="json"
              title="GET /v1/sms/msg_98412 -> 200 OK"
              code={`{
  "success": true,
  "data": {
    "sms_id": "msg_98412",
    "status": "delivered",
    "recipient": "+33612345678",
    "message": "Votre code de vérification SMS-Gateway est : 849201",
    "delivered_at": "2026-07-21T11:42:13Z"
  }
}`}
            />
          </section>

          {/* SECTION 5 : Webhooks */}
          <section id="webhooks" className="scroll-m-24 space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                  5
                </span>
                Webhooks & Vérification de Signature
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Lorsque l'état d'un message évolue vers <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">delivered</code> ou <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">failed</code>, notre serveur émet une requête POST HTTP vers vos URL configurées.
              </p>
            </div>

            <CodeBlock
              language="json"
              title="Exemple de Payload Webhook envoyé par le serveur"
              code={`{
  "event": "sms.delivered",
  "timestamp": 1784634133,
  "data": {
    "sms_id": "msg_98412",
    "recipient": "+33612345678",
    "status": "delivered",
    "delivered_at": "2026-07-21T11:42:13Z"
  }
}`}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Vérification de la signature HMAC (Node.js)</h3>
              <CodeBlock
                language="javascript"
                title="Vérification HMAC SHA-256"
                code={`const crypto = require('crypto');

function verifyWebhook(reqBody, signatureHeader, webhookSecret) {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(reqBody))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expectedSignature)
  );
}`}
              />
            </div>
          </section>

          {/* SECTION 6 : Codes d'Erreur */}
          <section id="error-codes" className="scroll-m-24 space-y-6 pt-6 border-t border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-bold">
                  6
                </span>
                Codes d’Erreur HTTP
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                L'API utilise les codes de réponse HTTP standards pour indiquer le succès ou l'échec de vos requêtes.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code HTTP</TableHead>
                  <TableHead>Nom de l’Erreur</TableHead>
                  <TableHead>Explication & Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><Badge variant="outline" className="font-mono">200 / 201</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">OK / Created</TableCell>
                  <TableCell className="text-xs text-slate-600">Requête exécutée avec succès.</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Badge variant="destructive" className="font-mono">401</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">Unauthorized</TableCell>
                  <TableCell className="text-xs text-slate-600">Clé API manquante, invalide ou révoquée.</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Badge variant="destructive" className="font-mono">402</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">Quota Exceeded</TableCell>
                  <TableCell className="text-xs text-slate-600">Votre quota de SMS mensuel est atteint. Passez à la formule supérieure.</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Badge variant="destructive" className="font-mono">422</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">Unprocessable Entity</TableCell>
                  <TableCell className="text-xs text-slate-600">Paramètres invalides (ex: numéro de téléphone sans indicatif +33).</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell><Badge variant="destructive" className="font-mono">500</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">Internal Error</TableCell>
                  <TableCell className="text-xs text-slate-600">Erreur interne du serveur ou perte de connexion avec la passerelle Android.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </main>
      </div>
    </div>
  );
}
