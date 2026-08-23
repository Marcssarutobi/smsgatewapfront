import React from 'react';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Ban,
  Smartphone,
  Scale,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';

export function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Disclaimer Alert Note — même avertissement que PrivacyPage, cohérence
          nécessaire : les deux documents ont le même statut de modèle générique. */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Avertissement Légal & Modèle Générique</p>
          <p className="text-amber-800 leading-relaxed">
            Ce document constitue un modèle d'exemple à titre illustratif pour ce template SaaS. Avant toute mise en production réelle de la plateforme, ce texte doit impérativement être adapté et validé par un juriste qualifié.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
          <Scale className="h-3.5 w-3.5 text-indigo-600" />
          <span>Cadre Contractuel</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm text-slate-600">
          Dernière mise à jour : 22 Août 2026 • Applicables à tout compte créé sur la plateforme
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              1. Objet et acceptation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation de la plateforme <strong>SMS Gateway SaaS</strong> (le « Service »), permettant l'envoi de SMS via une API à partir de téléphones Android connectés au compte de l'utilisateur.
            </p>
            <p>
              En créant un compte, en installant l'application mobile, ou en utilisant l'API, vous acceptez sans réserve l'intégralité des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service.
            </p>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              2. Description du Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>Le Service permet à l'utilisateur de :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Connecter un ou plusieurs téléphones Android à son compte via l'application mobile dédiée.</li>
              <li>Envoyer des SMS par le biais d'une API REST authentifiée par clé API, acheminés via la ou les cartes SIM des téléphones connectés.</li>
              <li>Consulter l'historique des envois, configurer des webhooks, et gérer son abonnement depuis le tableau de bord.</li>
            </ul>
            <p>
              L'utilisateur reste seul responsable de l'obtention et du maintien d'un forfait mobile actif et suffisant sur les cartes SIM utilisées, ainsi que des frais d'envoi de SMS facturés par son opérateur téléphonique, indépendamment de tout abonnement souscrit auprès de la plateforme.
            </p>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Ban className="h-5 w-5 text-indigo-600" />
              3. Utilisation interdite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>Il est strictement interdit d'utiliser le Service pour :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Envoyer des messages non sollicités, publicitaires ou frauduleux (spam), en violation de la réglementation applicable en matière de communications électroniques.</li>
              <li>Envoyer des messages à caractère illégal, diffamatoire, menaçant, ou portant atteinte aux droits d'un tiers.</li>
              <li>Usurper l'identité d'un tiers ou masquer l'origine réelle d'un message (« spoofing »).</li>
              <li>Tenter de contourner les quotas, les limites de débit (rate limiting), ou les mesures de sécurité de la plateforme.</li>
            </ul>
            <p>
              Tout manquement constaté à ces règles pourra entraîner la suspension immédiate du compte, sans préavis ni remboursement, et sans préjudice d'éventuelles poursuites judiciaires.
            </p>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              4. Abonnements, facturation et résiliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Chaque compte dispose d'un plan Trial gratuit d'une durée de 14 jours. Les plans payants (Starter, Business, Pro) sont facturés mensuellement via notre prestataire de paiement FedaPay, et donnent accès à un quota mensuel de SMS défini selon le plan choisi.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Les quotas non consommés au cours d'un mois ne sont pas reportés au mois suivant.</li>
              <li>Un changement de plan est applicable immédiatement ; l'ancien abonnement est annulé au profit du nouveau.</li>
              <li>L'utilisateur peut résilier son abonnement à tout moment depuis le tableau de bord, sans préavis ni frais de résiliation.</li>
              <li>Sauf obligation légale contraire, les sommes déjà versées ne sont pas remboursables au prorata en cas de résiliation en cours de mois.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-600" />
              5. Disponibilité et limitation de responsabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Le Service repose sur la disponibilité effective du ou des téléphones Android connectés par l'utilisateur (alimentation, réseau mobile, fonctionnement de l'application). La plateforme met en œuvre des moyens raisonnables pour assurer la continuité de l'envoi (détection de déconnexion, service en arrière-plan), mais ne peut garantir une disponibilité de 100%, celle-ci dépendant en partie de facteurs matériels hors de son contrôle direct.
            </p>
            <p>
              La responsabilité de la plateforme ne saurait être engagée en cas de non-délivrance d'un SMS résultant d'une panne réseau de l'opérateur, d'une coupure d'alimentation du téléphone connecté, ou d'un blocage par l'opérateur destinataire.
            </p>
          </CardContent>
        </Card>

        {/* Section 6 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              6. Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>Pour toute question relative aux présentes CGU, contactez-nous :</p>
            <p className="font-bold text-slate-900">
              E-mail : <a href="mailto:contact@smspasserelle.io" className="text-indigo-600 hover:underline">contact@smspasserelle.io</a>
            </p>
            <p className="text-xs text-slate-500">Adresse : Acme Technologies SAS, Cotonou, Bénin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
