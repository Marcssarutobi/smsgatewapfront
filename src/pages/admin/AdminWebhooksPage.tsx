import React, { useState } from 'react';
import {
  Webhook as WebhookIcon,
  Plus,
  Radio,
  Send,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { MOCK_WEBHOOKS } from '../../data/mockData';
import { Webhook } from '../../types';

export function AdminWebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(MOCK_WEBHOOKS);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['sms.delivered', 'sms.failed']);

  const handleTestWebhook = (url: string) => {
    setTestStatus(`Envoi d'un événement de test vers ${url}...`);
    setTimeout(() => {
      setTestStatus(`✅ Test réussi ! Réponse 200 OK reçue de ${url}.`);
      setTimeout(() => setTestStatus(null), 4000);
    }, 800);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const newWh: Webhook = {
      id: `wh_${Date.now()}`,
      url: newUrl,
      events: selectedEvents,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 14)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastDeliveryStatus: '200 OK',
      lastTriggeredAt: 'À l’instant'
    };

    setWebhooks([...webhooks, newWh]);
    setNewUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Webhooks & Callbacks</h2>
          <p className="text-xs text-slate-500">
            Recevez des notifications HTTP en temps réel sur vos serveurs lors des changements d'état de vos SMS.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="font-semibold gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Ajouter un Webhook
        </Button>
      </div>

      {testStatus && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-900 animate-in fade-in-0">
          {testStatus}
        </div>
      )}

      {/* Webhooks Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Endpoints Configurés ({webhooks.length})</CardTitle>
          <CardDescription className="text-xs">
            Signature HMAC SHA-256 incluse dans le header `X-Gateway-Signature`
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL de Callback</TableHead>
                <TableHead>Événements Écoutés</TableHead>
                <TableHead>Dernier Statut HTTP</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell className="font-mono text-xs">
                    <span className="font-bold text-slate-900 block truncate max-w-[280px]">{wh.url}</span>
                    <span className="text-[10px] text-slate-400">Secret : {wh.secret}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((ev) => (
                        <span key={ev} className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    {wh.lastDeliveryStatus === '200 OK' ? (
                      <Badge variant="success">{wh.lastDeliveryStatus}</Badge>
                    ) : (
                      <Badge variant="destructive">{wh.lastDeliveryStatus || 'N/A'}</Badge>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-0.5">{wh.lastTriggeredAt}</span>
                  </TableCell>

                  <TableCell>
                    {wh.status === 'active' ? (
                      <Badge variant="default">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">En pause</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleTestWebhook(wh.url)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold"
                    >
                      <Send className="h-3 w-3 mr-1 text-indigo-600" />
                      Tester
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal: Add Webhook */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogClose onClick={() => setIsModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WebhookIcon className="h-5 w-5 text-indigo-600" />
            Configurer un nouveau Webhook
          </DialogTitle>
          <DialogDescription className="text-xs">
            Indiquez l'URL de votre serveur prêt à recevoir les requêtes POST au format JSON.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddWebhook} className="space-y-4 my-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">URL Endpoint (HTTPS recommandé)</label>
            <Input
              type="url"
              required
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://api.votreapp.com/webhooks/sms"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Événements à déclencher :</label>
            <div className="space-y-2 text-xs text-slate-700">
              {['sms.delivered', 'sms.failed', 'sms.queued', 'device.offline'].map((ev) => (
                <label key={ev} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(ev)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedEvents([...selectedEvents, ev]);
                      else setSelectedEvents(selectedEvents.filter((x) => x !== ev));
                    }}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-mono font-medium">{ev}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" className="font-semibold">
              Enregistrer le Webhook
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
