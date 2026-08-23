import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Mail, Database, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Disclaimer Alert Note */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Avertissement Légal & Modèle Générique</p>
          <p className="text-amber-800 leading-relaxed">
            Ce document constitue un modèle d'exemple à titre illustratif pour ce template SaaS. Avant toute mise en production réelle de la plateforme, ce texte doit impérativement être adapté et validé par un juriste ou un DPO qualifié.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span>Protection des Données & RGPD</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Politique de Confidentialité
        </h1>
        <p className="text-sm text-slate-600">
          Dernière mise à jour : 21 Juillet 2026 • Conformité au Règlement Général sur la Protection des Données (RGPD)
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-600" />
              1. Données Personnelles Collectées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Dans le cadre de l’exploitation de la plateforme <strong>SMS Gateway SaaS</strong>, nous sommes amenés à collecter et traiter les catégories de données suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Données de votre compte client :</strong> Nom, prénom, adresse e-mail professionnelle, nom de la société, adresse postale et coordonnées de facturation.
              </li>
              <li>
                <strong>Données des destinataires de vos SMS :</strong> Numéros de téléphone des destinataires transmis via l'API REST dans le cadre exclusif de l'acheminement des messages.
              </li>
              <li>
                <strong>Contenu des messages SMS :</strong> Le corps des textes envoyés transite de façon temporaire et chiffrée sur nos serveurs de routage.
              </li>
              <li>
                <strong>Télémétrie des téléphones Android :</strong> Modèle de l'appareil, niveau de batterie, état de la connexion réseau (Wi-Fi / GSM), nom de l'opérateur de la carte SIM et identifiants techniques du device.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              2. Utilisation et Finalités du Traitement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>L'exécution et le routage en temps réel de vos SMS vers vos téléphones Android connectés.</li>
              <li>La gestion de la facturation, le suivi de vos quotas mensuels et le support technique.</li>
              <li>L'envoi des alertes de diagnostic (batterie faible sur un appareil, déconnexion du réseau).</li>
              <li>La prévention des fraudes et le respect des obligations légales d'identification.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              3. Conservation et Chiffrement des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Les journaux d’envoi des SMS (numéros et horodatages) sont conservés pendant une durée maximale de <strong>30 jours glissants</strong> à des fins de diagnostic technique et de génération de rapports, puis automatiquement anonymisés.
            </p>
            <p>
              Toutes les communications réseau entre vos serveurs, notre plateforme cloud et l’application Android sont protégées par le protocole de chiffrement SSL/TLS v1.3.
            </p>
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              4. Droits de l'Utilisateur (RGPD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700 leading-relaxed">
            <p>
              Conformément à la réglementation RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Droit d'accès et d'export :</strong> Vous pouvez télécharger l'ensemble des données de votre compte depuis le tableau de bord.</li>
              <li><strong>Droit de rectification et d'effacement :</strong> Vous pouvez demander la suppression définitive de votre compte et des logs associés.</li>
              <li><strong>Droit de réclamation :</strong> Vous avez le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              5. Contact pour la Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 space-y-2">
            <p>
              Pour toute question relative à cette politique ou pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO) :
            </p>
            <p className="font-bold text-slate-900">
              E-mail DPO : <a href="mailto:dpo@smspasserelle.io" className="text-indigo-600 hover:underline">dpo@smspasserelle.io</a>
            </p>
            <p className="text-xs text-slate-500">Adresse : Acme Technologies SAS, Cotonou, Bénin</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
