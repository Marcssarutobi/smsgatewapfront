import React, { useState } from 'react';
import { Zap, Check, Sparkles, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { usePlans } from '@/hook/features/usePlan';
import { useCheckoutSubscribe, useCurrentSubscription } from '@/hook/features/useSubscribe';

export function AdminSubscriptionPage() {
  const { data: subscription, isLoading: isLoadingSub } = useCurrentSubscription();
  const { data: plans = [], isLoading: isLoadingPlans } = usePlans();
  const { mutate: checkout, isPending: isSubscribing } = useCheckoutSubscribe();

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const currentPlan = subscription?.plan;
  const usedSms = subscription?.sms_used ?? 0;
  const maxSms = currentPlan?.sms_quota_monthly ?? 0;
  const remainingSms = Math.max(0, maxSms - usedSms);
  const usagePercentage = maxSms > 0 ? Math.round((usedSms / maxSms) * 100) : 0;

  const handleOpenChangeModal = () => {
    setSelectedPlanId(currentPlan?.id ?? plans[0]?.id ?? null);
    setCheckoutError(null);
    setIsChangeModalOpen(true);
  };

  const handlePlanChange = () => {
    if (!selectedPlanId) return;
    setCheckoutError(null);

    checkout(
      { plan_id: selectedPlanId },
      {
        onSuccess: (data) => {
          if (data.free && data.subscription) {
            // Plan gratuit : déjà activé côté back, rien à payer.
            setSuccessMessage(`Votre abonnement a été mis à jour vers le plan ${data.subscription.plan?.name} !`);
            setTimeout(() => setSuccessMessage(null), 4000);
            setIsChangeModalOpen(false);
            return;
          }

          if (data.checkout_url) {
            // Plan payant : redirection vers la page de paiement sécurisée FedaPay.
            // Le retour se fait sur /admin/subscription/callback, qui attend la
            // confirmation du webhook avant d'activer réellement l'abonnement.
            window.location.href = data.checkout_url;
          }
        },
        onError: (error: any) => {
          setCheckoutError(
            error?.response?.data?.message ?? "Impossible de démarrer le paiement pour le moment."
          );
        },
      }
    );
  };

  if (isLoadingSub) {
    return <p className="text-sm text-slate-500">Chargement de votre abonnement...</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Abonnement & Consommation</h2>
          <p className="text-xs text-slate-500">
            Suivez votre quota de SMS mensuel et gérez votre formule de facturation.
          </p>
        </div>
        <Button onClick={handleOpenChangeModal} className="font-semibold gap-2 shadow-sm">
          <Zap className="h-4 w-4" />
          {subscription ? 'Changer de plan' : 'Choisir un plan'}
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          {successMessage}
        </div>
      )}

      {!subscription ? (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">Aucun abonnement actif</p>
            <p className="text-xs text-slate-500">
              Choisissez un plan pour commencer à envoyer des SMS via l'API.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-xs font-semibold">
                  Formule Actuelle
                </Badge>
                <span className="text-xs text-slate-500">
                  Renouvellement le : {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <CardTitle className="text-2xl font-extrabold text-slate-900 mt-2">
                Plan {currentPlan?.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Consommation Mensuelle SMS</span>
                  <span className="text-indigo-600 font-mono">
                    {usedSms.toLocaleString()} / {maxSms.toLocaleString()} SMS
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2.5" />
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>{usagePercentage}% consommé</span>
                  <span className="font-semibold text-emerald-600">
                    {remainingSms.toLocaleString()} SMS restants
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Téléphones Android autorisés</span>
                  <span className="text-lg font-bold text-slate-900">
                    Jusqu'à {currentPlan?.max_devices} appareils
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block">Prix de l'abonnement</span>
                  <span className="text-lg font-bold text-slate-900">
                    {currentPlan?.price} {currentPlan?.currency} / mois
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4 bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Inclus dans votre plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{maxSms.toLocaleString()} SMS par mois</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Jusqu'à {currentPlan?.max_devices} téléphone(s) Android connecté(s)</span>
                </li>
                {(currentPlan?.features ?? []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Facturation : à venir, aucun backend de facturation pour le moment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-400" />
            Historique des Factures
          </CardTitle>
          <CardDescription className="text-xs">
            Fonctionnalité de facturation bientôt disponible.
          </CardDescription>
        </CardHeader>
      </Card>

      <Dialog open={isChangeModalOpen} onOpenChange={setIsChangeModalOpen}>
        <DialogClose onClick={() => setIsChangeModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Changer de Formule d'Abonnement
          </DialogTitle>
          <DialogDescription className="text-xs">
            Sélectionnez le plan correspondant le mieux à vos volumes d'envoi. Les plans payants
            sont réglés en toute sécurité via FedaPay (Mobile Money, carte bancaire...).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {checkoutError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
              {checkoutError}
            </div>
          )}

          {isLoadingPlans && <p className="text-xs text-slate-500">Chargement des plans...</p>}

          {!isLoadingPlans && plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedPlanId === plan.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{plan.name}</span>
                  {plan.id === currentPlan?.id && (
                    <Badge variant="secondary" className="text-[10px]">Actuel</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {plan.sms_quota_monthly.toLocaleString()} SMS / mois • Jusqu'à {plan.max_devices} appareils
                </p>
                {plan.features && plan.features.length > 0 && (
                  <p className="text-[10px] text-slate-400">
                    {plan.features.join(' • ')}
                  </p>
                )}
              </div>

              <span className="font-extrabold text-slate-900 text-lg">
                {plan.price} {plan.currency}
                <span className="text-xs text-slate-400 font-normal">/mois</span>
              </span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsChangeModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handlePlanChange} className="font-semibold" disabled={isSubscribing || !selectedPlanId}>
            {isSubscribing
              ? 'Redirection vers le paiement...'
              : selectedPlanId && plans.find((p) => p.id === selectedPlanId)?.price !== '0.00'
                ? 'Payer avec FedaPay'
                : 'Confirmer le changement de plan'}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}