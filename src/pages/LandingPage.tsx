import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Zap,
  ShieldCheck,
  Cpu,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Send,
  Radio,
  Server,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  Coins,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { MOCK_FAQS } from '../data/mockData';
import { usePlans } from '@/hook/features/usePlan';

// Formate un prix XOF (chaîne décimale côté back, ex "5000.00") en "5 000 FCFA".
function formatPrice(price: string, currency: string): string {
  const amount = Math.round(parseFloat(price));
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return currency === 'XOF' ? `${formatted} FCFA` : `${formatted} ${currency}`;
}

export function LandingPage() {
  const { data: plans = [], isLoading: isLoadingPlans } = usePlans();
  const activePlans = plans.filter((p) => p.active);
  // À défaut d'un champ "populaire" côté back, on met en avant le plan du milieu
  // (ni le moins cher ni le plus cher) une fois les plans triés par prix.
  const sortedPlans = [...activePlans].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  const popularPlanId = sortedPlans[Math.floor(sortedPlans.length / 2)]?.id;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200/80 pt-12 pb-20 lg:pt-20 lg:pb-28 editorial-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3.5 py-1.5 text-xs font-bold text-indigo-700 tracking-wider uppercase shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                <span>Passerelle SMS Android SaaS v1.4 • Économisez jusqu'à 90%</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl xl:text-6xl leading-[1.12]">
                Envoyez vos SMS depuis vos <span className="text-indigo-600 underline decoration-indigo-300 decoration-wavy">propres smartphones</span> Android
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connectez vos téléphones Android à notre API REST en 2 minutes via QR code. Profitez de vos forfaits SMS locaux à tarif préférentiel pour envoyer vos notifications, OTP et alertes à un coût imbattable.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-semibold shadow-md shadow-indigo-600/20 rounded-xl">
                    Démarrer gratuitement
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
                <Link to="/docs">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6 font-medium border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl">
                    Consulter la Doc API
                  </Button>
                </Link>
              </div>

              <div className="pt-1">
                <Link
                  to="/download-app"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <Smartphone className="h-4 w-4" />
                  Déjà client ? Téléchargez l&apos;application mobile
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Sans engagement
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Configuration QR Code 60 sec
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Support Dual-SIM natif
                </span>
              </div>
            </div>

            {/* Right Visual / Interactive Diagram */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Card simulation */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-indigo-900/10 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800">API Gateway en direct</span>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      99.98% En ligne
                    </Badge>
                  </div>

                  {/* Flow items */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <Server className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>Votre Serveur / App</span>
                          <span className="text-[10px] text-slate-400">POST /v1/sms/send</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">JSON Payload: {"{to: '+33612345678', msg: 'OTP: 8492'}"}</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 text-indigo-600 text-xs font-medium py-0.5">
                        <Radio className="h-3.5 w-3.5 animate-pulse" />
                        <span>Routage WebSocket sécurisé</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                      <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>Passerelle Android #1 (Orange)</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Batterie 98%</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">SMS envoyé via Carte SIM Slot 1 (+33 6 12 34 56 78)</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom metrics mini row */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-xs font-bold text-slate-900">1.2s</div>
                      <div className="text-[10px] text-slate-500">Temps de livraison</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-xs font-bold text-emerald-600">0 FCFA</div>
                      <div className="text-[10px] text-slate-500">Coût par SMS</div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-xs font-bold text-slate-900">Dual SIM</div>
                      <div className="text-[10px] text-slate-500">Support complet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMENT ÇA MARCHE (4 Étapes) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <Badge variant="default" className="text-xs font-semibold">
            Simplicité Déconcertante
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Comment fonctionne la passerelle en 4 étapes ?
          </h2>
          <p className="text-slate-600 text-base">
            Aucune compétence réseau complexe requise. Tout est synchronisé automatiquement en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Étape 1 */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <QrCode className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-200">01</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Scanner le QR Code</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Téléchargez notre APK Android ultra-légère et scannez le QR Code fourni dans votre espace d’administration.
            </p>
          </div>

          {/* Étape 2 */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-200">02</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Intégrer l’API REST</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Générez une clé API et appelez notre endpoint standard en cURL, Node.js, Python ou PHP.
            </p>
          </div>

          {/* Étape 3 */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <Send className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-200">03</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Envoyez vos SMS</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Le SMS est transmis à votre téléphone Android connecté qui l’expédie via sa propre carte SIM.
            </p>
          </div>

          {/* Étape 4 */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-indigo-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                <RefreshCw className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black text-slate-200">04</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">4. Suivi & Webhooks</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Recevez les confirmations de livraison instantanées par Webhooks HTTP sur votre propre serveur.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION FONCTIONNALITÉS */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <Badge variant="secondary" className="text-xs font-semibold">
            Infrastructures Robustes
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Des fonctionnalités conçues pour les développeurs
          </h2>
          <p className="text-slate-600 text-base">
            Tout le nécessaire pour gérer une flotte de téléphones Android et automatiser vos SMS sans tracas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle>API REST Ultra Simple</CardTitle>
              <CardDescription>
                Endpoints intuitifs et documentation claire pour intégrer l’envoi de SMS en moins de 10 minutes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Smartphone className="h-5 w-5" />
              </div>
              <CardTitle>Gestion Multi-Devices</CardTitle>
              <CardDescription>
                Connectez autant de smartphones Android que nécessaire pour répartir la charge d’envoi de manière équilibrée.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle>Multi-SIM & Bascule Auto</CardTitle>
              <CardDescription>
                Gestion native du Dual-SIM. Si une SIM est hors ligne ou a atteint son quota, la passerelle bascule sur la seconde.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Radio className="h-5 w-5" />
              </div>
              <CardTitle>Webhooks Temps Réel</CardTitle>
              <CardDescription>
                Soyez notifié instantanément lorsqu'un SMS passe au statut `delivered` ou `failed` avec signature HMAC sécurisée.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <BarChart3 className="h-5 w-5" />
              </div>
              <CardTitle>Tableau de bord Complet</CardTitle>
              <CardDescription>
                Surveillez le niveau de batterie, l'état du réseau, les quotas quotidiens et les logs d'envoi en direct.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle>Sécurité & Chiffrement</CardTitle>
              <CardDescription>
                Clés API révocables, permissions granulaires et communications chiffrées de bout en bout en TLS v1.3.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 4. SECTION EXPLICATION DÉTAILLÉE DU SAAS (Modèle économique) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 lg:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Coins className="h-3.5 w-3.5 text-indigo-400" />
                <span>Pourquoi ce modèle change la donne ?</span>
              </div>

              <h2 className="text-3xl font-extrabold sm:text-4xl text-white leading-tight">
                Arrêtez de payer des surtaxes opérateurs pour vos SMS applicatifs
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Les fournisseurs d'API SMS traditionnels (Twilio, Vonage, SMSMode) vendent la route opérateur entre 30 FCFA et 52 FCFA par SMS. Pour 10 000 SMS par mois, cela représente rapidement entre <strong>295 000 FCFA et 525 000 FCFA mensuels</strong>.
              </p>

              <p className="text-slate-300 text-base leading-relaxed">
                Avec <strong>SMS Gateway SaaS</strong>, vous connectez vos propres téléphones Android équipés de forfaits SMS locaux (MTN, Moov) à tarif préférentiel — par exemple <strong>5 000 FCFA pour 500 SMS</strong>, soit environ <strong>10 FCFA par SMS</strong>, contre 30 à 52 FCFA via les API classiques.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xs text-slate-400 font-semibold uppercase">API SMS Classique</div>
                  <div className="text-2xl font-bold text-rose-400 mt-1">~328 000 FCFA / mois</div>
                  <div className="text-xs text-slate-400 mt-1">Facturation par SMS individuel</div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40">
                  <div className="text-xs text-indigo-300 font-semibold uppercase">Notre Passerelle Android</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">60 000 FCFA / mois fixe</div>
                  <div className="text-[10px] text-indigo-300/70 mt-0.5">Plan Pro — jusqu'à 12 000 SMS/mois inclus</div>
                  <div className="text-xs text-indigo-200 mt-1">+ vos forfaits SMS locaux (dès 10 FCFA/SMS)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-inner space-y-4">
                <div className="text-xs font-mono text-indigo-400 flex items-center justify-between border-b border-slate-700 pb-2">
                  <span>ARCHITECTURE SAAS</span>
                  <span className="text-emerald-400 font-bold">DIRECT LINK</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="text-slate-300 font-medium">1. Client / Application</span>
                    <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">JSON API</Badge>
                  </div>
                  <div className="text-center text-slate-500 font-mono text-[10px]">↓ HTTP REST Call</div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-indigo-900/60 border border-indigo-700">
                    <span className="text-indigo-200 font-medium">2. Serveur SMS Gateway</span>
                    <Badge className="text-[10px] bg-indigo-600">WebSocket</Badge>
                  </div>
                  <div className="text-center text-slate-500 font-mono text-[10px]">↓ Direct Push</div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-700">
                    <span className="text-slate-300 font-medium">3. Smartphone Android</span>
                    <Badge variant="success" className="text-[10px]">SIM Active</Badge>
                  </div>
                  <div className="text-center text-slate-500 font-mono text-[10px]">↓ Antenne GSM Opérateur</div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                    <span>4. Destinataire Final</span>
                    <span>100% Livré</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION TARIFS */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
          <Badge variant="default" className="text-xs font-semibold">
            Tarifs Transparents
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Des forfaits simples adaptés à vos besoins
          </h2>
          <p className="text-slate-600 text-base">
            Aucuns frais cachés par SMS. Choisissez le nombre de téléphones connectés et le volume souhaité.
            Facturation mensuelle, sans engagement — changez ou annulez à tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {isLoadingPlans && (
            <p className="col-span-3 text-center text-sm text-slate-400">Chargement des offres...</p>
          )}

          {!isLoadingPlans && activePlans.length === 0 && (
            <p className="col-span-3 text-center text-sm text-slate-400">
              Aucune offre disponible pour le moment.
            </p>
          )}

          {sortedPlans.map((plan) => {
            const isPopular = plan.id === popularPlanId;
            // Certains plans (ex: Trial) n'ont pas de liste `features` en base :
            // on reconstruit une liste minimale à partir des champs bruts du plan.
            const features = plan.features?.length ? plan.features : [
              `${plan.sms_quota_monthly.toLocaleString('fr-FR')} SMS / mois inclus`,
              `Jusqu'à ${plan.max_devices} téléphone${plan.max_devices > 1 ? 's' : ''} Android connecté${plan.max_devices > 1 ? 's' : ''}`,
              'API REST complète v1',
              'Support des cartes Dual-SIM',
            ];

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all ${
                  isPopular
                    ? 'border-2 border-indigo-600 shadow-xl ring-1 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
                    Le Plus Populaire
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 min-h-[32px]">
                    {parseFloat(plan.price) === 0
                      ? "Idéal pour tester votre passerelle avant de vous engager."
                      : `Jusqu'à ${plan.max_devices} téléphone${plan.max_devices > 1 ? 's' : ''} connecté${plan.max_devices > 1 ? 's' : ''}.`}
                  </p>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    {parseFloat(plan.price) === 0 ? 'Gratuit' : formatPrice(plan.price, plan.currency)}
                  </span>
                  {parseFloat(plan.price) > 0 && (
                    <span className="text-sm font-semibold text-slate-500">/ mois</span>
                  )}
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                    Ce qui est inclus :
                  </div>
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/register?plan=${plan.id}`} className="mt-auto">
                  <Button
                    variant={isPopular ? 'default' : 'outline'}
                    className="w-full font-semibold py-2.5"
                  >
                    Choisir la formule {plan.name}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SECTION FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="secondary" className="text-xs font-semibold">
            Questions Fréquentes
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-slate-600 text-base">
            Vous avez une question sur le fonctionnement technique ou légal ? Retrouvez nos réponses ci-dessous.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          {MOCK_FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-slate-900 hover:text-indigo-600 font-semibold text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Prêt à transformer vos téléphones Android en passerelles SMS ?
          </h2>
          <p className="text-indigo-100 text-base max-w-xl mx-auto">
            Créez votre compte en 1 minute. Configurez votre premier appareil et envoyez vos premiers SMS de test dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-slate-100 font-bold px-8 h-12 shadow-md">
                Créer un compte gratuitement
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-indigo-300/40 text-white hover:bg-indigo-700/50 h-12">
                Contacter un conseiller
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
