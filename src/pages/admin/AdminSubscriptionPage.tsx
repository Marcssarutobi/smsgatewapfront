import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, ArrowRight, Download, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { MOCK_PLANS } from '../../data/mockData';

export function AdminSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState(MOCK_PLANS[1]); // Plan Business
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(MOCK_PLANS[1].id);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const usedSms = 14280;
  const maxSms = currentPlan.smsQuotaMonthly;
  const remainingSms = maxSms - usedSms;
  const usagePercentage = Math.round((usedSms / maxSms) * 100);

  const handlePlanChange = () => {
    const newPlan = MOCK_PLANS.find((p) => p.id === selectedPlanId);
    if (newPlan) {
      setCurrentPlan(newPlan);
      setSuccessMessage(`Votre abonnement a été mis à jour vers le plan ${newPlan.name} !`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
    setIsChangeModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Abonnement & Consommation</h2>
          <p className="text-xs text-slate-500">
            Suivez votre quota de SMS mensuel et gérez votre formule de facturation.
          </p>
        </div>
        <Button onClick={() => setIsChangeModalOpen(true)} className="font-semibold gap-2 shadow-sm">
          <Zap className="h-4 w-4" />
          Changer de plan
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          {successMessage}
        </div>
      )}

      {/* Current Plan Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="text-xs font-semibold">
                Formule Actuelle
              </Badge>

              <span className="text-xs text-slate-500">Renouvellement le : 01 Août 2026</span>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 mt-2">
              Plan {currentPlan.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {currentPlan.tagline}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Quota Progress */}
            <div className="space-y-2 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Consommation Mensuelle SMS</span>
                <span className="text-indigo-600 font-mono">{usedSms.toLocaleString()} / {maxSms.toLocaleString()} SMS</span>
              </div>
              <Progress value={usagePercentage} className="h-2.5" />
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>{usagePercentage}% consommé</span>
                <span className="font-semibold text-emerald-600">{remainingSms.toLocaleString()} SMS restants</span>
              </div>
            </div>

            {/* Devices Allowance */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Téléphones Android autorisés</span>
                <span className="text-lg font-bold text-slate-900">Jusqu'à {currentPlan.maxDevices} appareils</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block">Prix de l'abonnement</span>
                <span className="text-lg font-bold text-slate-900">{currentPlan.priceMonthly} € / mois</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Box */}
        <Card className="lg:col-span-4 bg-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Inclus dans votre plan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2.5 text-xs text-slate-300">
              {currentPlan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Invoices History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Historique des Factures</CardTitle>
          <CardDescription className="text-xs">
            Téléchargez vos reçus et factures au format PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'INV-2026-07', date: '01 Juillet 2026', amount: '79.00 €', plan: 'Business Mensuel', status: 'Payée' },
              { id: 'INV-2026-06', date: '01 Juin 2026', amount: '79.00 €', plan: 'Business Mensuel', status: 'Payée' },
              { id: 'INV-2026-05', date: '01 Mai 2026', amount: '79.00 €', plan: 'Business Mensuel', status: 'Payée' },
            ].map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{inv.id} — {inv.plan}</span>
                    <span className="text-[10px] text-slate-400">{inv.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">{inv.amount}</span>
                  <Badge variant="success">{inv.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal: Change Plan */}
      <Dialog open={isChangeModalOpen} onOpenChange={setIsChangeModalOpen}>
        <DialogClose onClick={() => setIsChangeModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Changer de Formule d'Abonnement
          </DialogTitle>
          <DialogDescription className="text-xs">
            Sélectionnez le plan correspondant le mieux à vos volumes d'envoi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {MOCK_PLANS.map((plan) => (
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
                  {plan.id === currentPlan.id && <Badge variant="secondary" className="text-[10px]">Actuel</Badge>}
                </div>
                <p className="text-xs text-slate-500">{plan.smsQuotaMonthly.toLocaleString()} SMS / mois • Jusqu'à {plan.maxDevices} appareils</p>
              </div>

              <span className="font-extrabold text-slate-900 text-lg">{plan.priceMonthly} €<span className="text-xs text-slate-400 font-normal">/mois</span></span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsChangeModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handlePlanChange} className="font-semibold">
            Confirmer le changement de plan
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
