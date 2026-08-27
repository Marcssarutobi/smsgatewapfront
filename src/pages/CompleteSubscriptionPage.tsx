import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { ChannelDurationSelector } from '../components/ChannelDurationSelector';
import { useCheckoutSubscribe } from '@/hook/features/useSubscribe';
import { planService } from '@/services/planService';
import { Plan } from '@/type/plan';
import { SmsChannel } from '@/type/subscription';
import toast from 'react-hot-toast';
import { PENDING_PLAN_STORAGE_KEY } from './RegisterPage';

export function CompleteSubscriptionPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const { mutateAsync: checkout, isPending: isCheckingOut } = useCheckoutSubscribe();

  // Cette page n'a de sens que juste après une inscription avec un plan
  // choisi sur la landing page (voir RegisterPage/GoogleCallbackPage).
  // Si on y arrive directement sans plan en attente, rien à faire ici.
  useEffect(() => {
    const pendingPlanId = sessionStorage.getItem(PENDING_PLAN_STORAGE_KEY);

    if (!pendingPlanId) {
      navigate('/admin', { replace: true });
      return;
    }

    planService.listPlan()
      .then((plans) => {
        const found = plans.find((p) => p.id === Number(pendingPlanId));
        if (!found) {
          // Plan introuvable/désactivé entre-temps : rien à facturer, direct au dashboard.
          sessionStorage.removeItem(PENDING_PLAN_STORAGE_KEY);
          navigate('/admin', { replace: true });
          return;
        }
        setPlan(found);
      })
      .finally(() => setIsLoadingPlan(false));
  }, [navigate]);

  const handleConfirm = async (channel: SmsChannel, durationMonths: 1 | 3 | 6 | 12) => {
    if (!plan) return;

    sessionStorage.removeItem(PENDING_PLAN_STORAGE_KEY);

    try {
      const data = await checkout({ plan_id: plan.id, channel, duration_months: durationMonths });
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      // Gratuit (ex: Trial en mode Device) : déjà activé côté serveur.
      navigate('/admin', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Une erreur est survenue, réessayez.');
      navigate('/admin', { replace: true });
    }
  };

  if (isLoadingPlan) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center">
        <p className="text-sm text-slate-400">Chargement...</p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SMS Gateway</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Finalisez votre abonnement {plan.name}</h1>
          <p className="text-sm text-slate-500">Dernière étape avant d'accéder à votre tableau de bord.</p>
        </div>

        <Card className="shadow-lg border-slate-200/80">
          <CardHeader>
            <CardTitle className="text-base">Vos préférences d'envoi</CardTitle>
            <CardDescription>Vous pourrez changer d'avis plus tard depuis vos paramètres.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChannelDurationSelector plan={plan} onConfirm={handleConfirm} isSubmitting={isCheckingOut} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
