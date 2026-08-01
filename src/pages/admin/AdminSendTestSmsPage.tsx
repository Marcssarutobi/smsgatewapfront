import React, { useState } from 'react';
import { Send, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAllApikey } from '@/hook/features/useApiKey';
import { useSendTestSms } from '@/hook/features/useSmsTest';

export function AdminSendTestSmsPage() {
  const { data: apiKeys = [], isLoading: isLoadingKeys } = useAllApikey();
  const { mutate: sendSms, isPending, data: result, error, reset } = useSendTestSms();

  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const activeKeys = apiKeys.filter((k) => k.status === 'active');
  const selectedKey = activeKeys.find((k) => k.id === selectedKeyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    reset();
    sendSms({ apiKey: selectedKey.key, to, message });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Envoyer un SMS de test</h2>
        <p className="text-xs text-slate-500">
          Vérifie que ta passerelle fonctionne correctement, sans passer par du code externe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">Nouveau message</CardTitle>
          <CardDescription className="text-xs">
            Envoyé immédiatement via l'API, en utilisant une de tes clés actives.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Clé API à utiliser</label>
              {isLoadingKeys ? (
                <p className="text-xs text-slate-400">Chargement des clés...</p>
              ) : activeKeys.length === 0 ? (
                <p className="text-xs text-amber-600">
                  Aucune clé API active. Crée-en une dans "Clés API" avant de tester.
                </p>
              ) : (
                <select
                  value={selectedKeyId ?? ''}
                  onChange={(e) => setSelectedKeyId(Number(e.target.value))}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                >
                  <option value="" disabled>Sélectionner une clé</option>
                  {activeKeys.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.key.startsWith('sk_live_') ? 'live' : 'test'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Numéro destinataire</label>
              <Input
                type="text"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="+22997000000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Message</label>
              <textarea
                required
                maxLength={918}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Ceci est un message de test depuis mon dashboard."
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">{message.length}/918 caractères</p>
            </div>

            {result && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                SMS #{result.id} créé avec le statut <code className="font-mono font-bold">{result.status}</code>. Suis son évolution dans l'historique des envois.
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                {(error as any)?.response?.data?.message ?? "Échec de l'envoi, réessaie."}
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-end border-t border-slate-100 pt-4">
            <Button type="submit" className="gap-2 font-semibold" disabled={isPending || !selectedKey}>
              <Send className="h-4 w-4" />
              {isPending ? 'Envoi...' : 'Envoyer le SMS'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}