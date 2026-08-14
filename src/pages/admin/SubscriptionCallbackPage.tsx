// src/pages/admin/SubscriptionCallbackPage.tsx
//
// Page de retour après paiement FedaPay (callback_url passé lors de la création
// de la transaction dans PaymentController::checkout côté backend).
// FedaPay redirige ici avec ?payment_id=... ; le webhook FedaPay est la source de
// vérité pour l'activation de l'abonnement, donc on "poll" le statut du paiement
// en attendant sa confirmation plutôt que de faire confiance à la simple redirection.
import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { usePaymentStatus } from '@/hook/features/useSubscribe';

export function SubscriptionCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const paymentId = Number(params.get('payment_id'));
  const hasPaymentId = Number.isInteger(paymentId) && paymentId > 0;

  const { data, isLoading, isError } = usePaymentStatus(hasPaymentId ? paymentId : null, hasPaymentId);

  const status = data?.status;

  useEffect(() => {
    if (status === 'approved') {
      // L'abonnement vient d'être activé côté back (webhook) : on rafraîchit le cache.
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    }
  }, [status, queryClient]);

  if (!hasPaymentId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <XCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-semibold text-slate-800">Lien de retour de paiement invalide.</p>
        <Link to="/admin/abonnement">
          <Button variant="outline">Retour à l'abonnement</Button>
        </Link>
      </div>
    );
  }

  if ((isLoading && !data) || status === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-800">Confirmation du paiement en cours...</p>
        <p className="text-xs text-slate-500 max-w-sm">
          Merci de patienter quelques secondes, le temps que FedaPay confirme votre transaction.
          Ne fermez pas cette page.
        </p>
      </div>
    );
  }

  if (isError || status === 'declined' || status === 'canceled' || status === 'failed') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <XCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-semibold text-slate-800">
          {status === 'canceled' ? 'Paiement annulé.' : 'Le paiement a échoué.'}
        </p>
        <p className="text-xs text-slate-500 max-w-sm">
          Aucun montant n'a été débité sur votre abonnement actuel. Vous pouvez réessayer à tout moment.
        </p>
        <Button onClick={() => navigate('/admin/abonnement')}>Retour à l'abonnement</Button>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="text-sm font-semibold text-slate-800">
          Paiement confirmé ! Votre plan {data?.subscription?.plan?.name} est actif.
        </p>
        <Button onClick={() => navigate('/admin/abonnement')}>Voir mon abonnement</Button>
      </div>
    );
  }

  return null;
}
