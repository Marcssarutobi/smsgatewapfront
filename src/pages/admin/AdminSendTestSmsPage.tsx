import React, { useState } from 'react';
import { Send, CheckCircle2, XCircle, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { ApiKey } from '@/type/apiKey';
import { useAllApikey } from '@/hook/features/useApiKey';
import { useSendBulkTestSms, useSendTestSms } from '@/hook/features/useSmsTest';

// Sélecteur de clé API, partagé entre l'onglet "un numéro" et "plusieurs numéros".
function ApiKeySelect({
  activeKeys,
  isLoading,
  value,
  onChange,
}: {
  activeKeys: ApiKey[];
  isLoading: boolean;
  value: number | null;
  onChange: (id: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700">Clé API à utiliser</label>
      {isLoading ? (
        <p className="text-xs text-slate-400">Chargement des clés...</p>
      ) : activeKeys.length === 0 ? (
        <p className="text-xs text-amber-600">
          Aucune clé API active. Une paire test/prod est normalement générée automatiquement à
          l'inscription — régénère tes clés depuis "Clés API" si besoin.
        </p>
      ) : (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          required
        >
          <option value="" disabled>Sélectionner une clé</option>
          {activeKeys.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name} ({k.environment})
            </option>
          ))}
        </select>
      )}
      {activeKeys.find((k) => k.id === value)?.environment === 'test' && (
        <p className="text-[11px] text-indigo-600">
          Clé de test sélectionnée : chaque message sera signé automatiquement
          "Message de test SMS-gatewap".
        </p>
      )}
    </div>
  );
}

export function AdminSendTestSmsPage() {
  const { data: apiKeys = [], isLoading: isLoadingKeys } = useAllApikey();
  const activeKeys = apiKeys.filter((k) => k.status === 'active');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Envoyer un SMS de test</h2>
        <p className="text-xs text-slate-500">
          Vérifie que ta passerelle fonctionne correctement, sans passer par du code externe.
        </p>
      </div>

      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Un numéro</TabsTrigger>
          <TabsTrigger value="bulk">Plusieurs numéros</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <SingleSendCard activeKeys={activeKeys} isLoadingKeys={isLoadingKeys} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkSendCard activeKeys={activeKeys} isLoadingKeys={isLoadingKeys} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SingleSendCard({ activeKeys, isLoadingKeys }: { activeKeys: ApiKey[]; isLoadingKeys: boolean }) {
  const { mutate: sendSms, isPending, data: result, error, reset } = useSendTestSms();

  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  const selectedKey = activeKeys.find((k) => k.id === selectedKeyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;

    reset();
    sendSms({ apiKey: selectedKey.key, to, message });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">Nouveau message</CardTitle>
        <CardDescription className="text-xs">
          Envoyé immédiatement via l'API, en utilisant une de tes clés actives.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ApiKeySelect
            activeKeys={activeKeys}
            isLoading={isLoadingKeys}
            value={selectedKeyId}
            onChange={setSelectedKeyId}
          />

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
  );
}

function BulkSendCard({ activeKeys, isLoadingKeys }: { activeKeys: ApiKey[]; isLoadingKeys: boolean }) {
  const { mutate: sendBulk, isPending, data: result, error, reset } = useSendBulkTestSms();

  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);
  const [toRaw, setToRaw] = useState('');
  const [message, setMessage] = useState('');

  const selectedKey = activeKeys.find((k) => k.id === selectedKeyId);

  // Un numéro par ligne (ou séparés par des virgules), on nettoie les entrées vides.
  const recipients = toRaw
    .split(/[\n,]/)
    .map((n) => n.trim())
    .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey || recipients.length === 0) return;

    reset();
    sendBulk({ apiKey: selectedKey.key, to: recipients, message });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-600" />
          Envoi groupé
        </CardTitle>
        <CardDescription className="text-xs">
          Le même message est envoyé à chaque numéro. Un envoi de 100 destinataires maximum par requête.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <ApiKeySelect
            activeKeys={activeKeys}
            isLoading={isLoadingKeys}
            value={selectedKeyId}
            onChange={setSelectedKeyId}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Numéros destinataires (un par ligne, ou séparés par des virgules)
            </label>
            <textarea
              required
              value={toRaw}
              onChange={(e) => setToRaw(e.target.value)}
              rows={5}
              placeholder={'+22997000000\n+22990000000\n+22996000000'}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-400">
              {recipients.length} destinataire{recipients.length > 1 ? 's' : ''} détecté{recipients.length > 1 ? 's' : ''}
              {recipients.length > 100 && ' — dépasse la limite de 100'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Message</label>
            <textarea
              required
              maxLength={918}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Ceci est un message envoyé à plusieurs destinataires."
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-400">{message.length}/918 caractères</p>
          </div>

          {result && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              {result.message}
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
          <Button
            type="submit"
            className="gap-2 font-semibold"
            disabled={isPending || !selectedKey || recipients.length === 0 || recipients.length > 100}
          >
            <Send className="h-4 w-4" />
            {isPending ? 'Envoi...' : `Envoyer à ${recipients.length || 0} numéro${recipients.length > 1 ? 's' : ''}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
