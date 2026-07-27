import React, { useState } from 'react';
import {
  Webhook as WebhookIcon,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { useCreateWebhook, useDeleteWebhook, useToggleWebhook, useWebhooks } from '@/hook/features/useWebhooks';


const AVAILABLE_EVENTS = ['sms.sent', 'sms.delivered', 'sms.failed'];

export function AdminWebhooksPage() {
  const { data: webhooks = [], isLoading } = useWebhooks();
  const { mutate: createWebhook, isPending: isCreating } = useCreateWebhook();
  const { mutate: toggleWebhook } = useToggleWebhook();
  const { mutate: deleteWebhook } = useDeleteWebhook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('sms.delivered');

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    createWebhook(
      { url: newUrl, event: selectedEvent },
      {
        onSuccess: () => {
          setNewUrl('');
          setSelectedEvent('sms.delivered');
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleToggle = (id: number) => {
    toggleWebhook(id);
  };

  const handleDelete = (id: number) => {
    deleteWebhook(id);
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Endpoints Configurés ({webhooks.length})</CardTitle>
          <CardDescription className="text-xs">
            Chaque webhook écoute un seul type d'événement SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL de Callback</TableHead>
                <TableHead>Événement Écouté</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-slate-400">
                    Chargement des webhooks...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && webhooks.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell className="font-mono text-xs">
                    <span className="font-bold text-slate-900 block truncate max-w-[280px]">{wh.url}</span>
                  </TableCell>

                  <TableCell>
                    <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">
                      {wh.event}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {new Date(wh.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>

                  <TableCell>
                    {wh.active ? (
                      <Badge variant="default">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">En pause</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => handleToggle(wh.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold"
                      >
                        {wh.active ? 'Mettre en pause' : 'Réactiver'}
                      </Button>
                      <Button
                        onClick={() => handleDelete(wh.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && webhooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-slate-400">
                    Aucun webhook configuré pour le moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogClose onClick={() => setIsModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WebhookIcon className="h-5 w-5 text-indigo-600" />
            Configurer un nouveau Webhook
          </DialogTitle>
          <DialogDescription className="text-xs">
            Indiquez l'URL de votre serveur prêt à recevoir une requête POST au format JSON.
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Événement à écouter</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {AVAILABLE_EVENTS.map((ev) => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400">
              Besoin d'écouter plusieurs événements ? Crée un webhook par événement (même URL possible).
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" className="font-semibold" disabled={isCreating}>
              {isCreating ? 'Enregistrement...' : 'Enregistrer le Webhook'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}