import React, { useState } from 'react';
import { Smartphone, Radio, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Plan } from '../type/plan';
import { SmsChannel } from '../type/subscription';
import { useSmsPricing } from '../hook/features/useSmsPricing';

const DURATIONS: Array<{ value: 1 | 3 | 6 | 12; label: string }> = [
  { value: 1, label: '1 mois' },
  { value: 3, label: '3 mois' },
  { value: 6, label: '6 mois' },
  { value: 12, label: '12 mois' },
];

interface ChannelDurationSelectorProps {
  plan: Plan;
  onConfirm: (channel: SmsChannel, durationMonths: 1 | 3 | 6 | 12) => void;
  isSubmitting?: boolean;
  confirmLabel?: string;
}

export function ChannelDurationSelector({
  plan,
  onConfirm,
  isSubmitting = false,
  confirmLabel = 'Confirmer et continuer',
}: ChannelDurationSelectorProps) {
  const [channel, setChannel] = useState<SmsChannel>('device');
  const [duration, setDuration] = useState<1 | 3 | 6 | 12>(1);
  const { data: pricing, isLoading: isPricingLoading } = useSmsPricing();

  const basePrice = Number(plan.price);
  const smsRate = pricing ? Number(pricing.price_per_sms) : 0;
  const smsCostPerMonth = channel === 'network' ? plan.sms_quota_monthly * smsRate : 0;
  const totalPerMonth = basePrice + smsCostPerMonth;
  const total = totalPerMonth * duration;

  const formatAmount = (amount: number) =>
    `${amount.toLocaleString('fr-FR')} ${plan.currency}`;

  return (
    <div className="space-y-6">
      {/* Choix du canal */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Comment souhaitez-vous envoyer vos SMS ?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setChannel('device')}
            className={`relative text-left p-4 rounded-xl border-2 transition-colors ${
              channel === 'device' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {channel === 'device' && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-indigo-600" />}
            <Smartphone className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Téléphone (Device)</p>
            <p className="text-xs text-slate-500 mt-1">
              Utilisez votre propre téléphone Android via l'app mobile. Aucun frais SMS supplémentaire.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setChannel('network')}
            className={`relative text-left p-4 rounded-xl border-2 transition-colors ${
              channel === 'network' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {channel === 'network' && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-indigo-600" />}
            <Radio className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-bold text-slate-900">Réseau (sans téléphone)</p>
            <p className="text-xs text-slate-500 mt-1">
              Envoi direct via notre opérateur partenaire. Coût SMS ajouté au prix de l'abonnement.
            </p>
          </button>
        </div>
      </div>

      {/* Durée */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-2">Durée de l'abonnement</p>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDuration(d.value)}
              className={`py-2 rounded-lg border-2 text-xs font-semibold transition-colors ${
                duration === d.value
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Récapitulatif du prix */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Abonnement {plan.name} × {duration} mois</span>
          <span>{formatAmount(basePrice * duration)}</span>
        </div>
        {channel === 'network' && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Coût SMS ({plan.sms_quota_monthly.toLocaleString('fr-FR')} SMS × {duration} mois)</span>
            <span>{isPricingLoading ? '...' : formatAmount(smsCostPerMonth * duration)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
          <span>Total à payer</span>
          <span>{isPricingLoading ? '...' : formatAmount(total)}</span>
        </div>
      </div>

      <Button
        onClick={() => onConfirm(channel, duration)}
        disabled={isSubmitting || isPricingLoading}
        className="w-full font-semibold h-11"
      >
        {isSubmitting ? 'Traitement...' : confirmLabel}
      </Button>
    </div>
  );
}
