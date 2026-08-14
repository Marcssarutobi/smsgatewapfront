import React, { useState } from 'react';
import {
  KeyRound,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { useAllApikey, useCreateApiKey, useDeleteApiKey, useRevokeApiKey } from '@/hook/features/useApiKey';

interface CreatedKey {
  id: number;
  name: string;
  environment: string;
  key: string;
}

export function AdminApiKeysPage() {
  const { data: keys = [], isLoading } = useAllApikey();
  const { mutate: createApiKey, isPending: isCreating } = useCreateApiKey();
  const { mutate: revokeApiKey } = useRevokeApiKey();
  const { mutate: deleteApiKey } = useDeleteApiKey();

  const [copiedKeyId, setCopiedKeyId] = useState<number | string | null>(null);
  const [revealedKeyId, setRevealedKeyId] = useState<number | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKeys, setCreatedKeys] = useState<CreatedKey[] | null>(null);

  const maskKey = (key: string) => `${key.slice(0, 12)}••••••••••••${key.slice(-4)}`;

  const handleCopy = (id: number | string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();

    createApiKey(newKeyName || undefined, {
      onSuccess: (data) => {
        setCreatedKeys(data.keys);
      },
    });
  };

  const handleRevoke = (id: number) => {
    revokeApiKey(id);
  };

  const handleDelete = (id: number) => {
    deleteApiKey(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clé API</h2>
          <p className="text-xs text-slate-500">
            Une paire de clés (test + production) est générée automatiquement à la création de ton compte.
            Régénère-les uniquement si l'une d'elles a fuité : les anciennes cessent immédiatement de fonctionner.
          </p>
        </div>
        <Button
          onClick={() => { setCreatedKeys(null); setNewKeyName(''); setIsCreateModalOpen(true); }}
          className="font-semibold gap-2 shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          {keys.length > 0 ? 'Régénérer mes clés API' : 'Générer mes clés API'}
        </Button>
      </div>

      {/* Security Warning Box */}
      <Card className="bg-amber-50/60 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold">Consignes de Sécurité Importantes</p>
            <p className="text-amber-800 leading-relaxed">
              Vos clés API possèdent les privilèges d'envoi de SMS sur vos appareils. Ne partagez jamais vos clés privées dans du code client JavaScript public ou des répertoires Git publics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Clés API Actives et Révoquées ({keys.length})</CardTitle>
          <CardDescription className="text-xs">
            Authentification par header `Authorization: Bearer VOTRE_CLE_API`
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la Clé</TableHead>
                <TableHead>Environnement</TableHead>
                <TableHead>Clé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Dernière Utilisation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-sm text-slate-400">
                    Chargement des clés...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-bold text-xs text-slate-900">{k.name}</TableCell>

                  <TableCell>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      k.environment === 'live'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {k.environment}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                        {revealedKeyId === k.id ? k.key : maskKey(k.key)}
                      </span>
                      <button
                        onClick={() => setRevealedKeyId(revealedKeyId === k.id ? null : k.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      >
                        {revealedKeyId === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(k.id, k.key)}
                        className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                      >
                        {copiedKeyId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>
                    {k.status === 'active' ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Révoquée</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">
                    {new Date(k.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleString('fr-FR') : 'Jamais'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {k.status === 'active' && (
                        <Button
                          onClick={() => handleRevoke(k.id)}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                        >
                          Révoquer
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(k.id)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && keys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-sm text-slate-400">
                    Aucune clé API pour le moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal: Create API Key */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogClose onClick={() => setIsCreateModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-600" />
            {keys.length > 0 ? 'Régénérer mes clés API' : 'Générer mes clés API'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Une clé de <strong>test</strong> et une clé de <strong>production</strong> seront générées ensemble.
          </DialogDescription>
        </DialogHeader>

        {!createdKeys ? (
          <form onSubmit={handleCreateKey} className="space-y-4 my-4">
            {keys.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Tes clés actuelles seront immédiatement invalidées. Toute intégration qui les
                  utilise encore cessera de fonctionner tant que tu ne l'auras pas mise à jour.
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nom / Utilisation de la clé</label>
              <Input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Ex: Serveur Production - Backend Laravel"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="font-semibold" disabled={isCreating}>
                {isCreating ? 'Génération...' : keys.length > 0 ? 'Régénérer les clés' : 'Générer les clés'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 my-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Check className="h-4 w-4 text-emerald-600" />
                Clés API générées avec succès !
              </p>
              <p className="text-slate-600">
                Copiez ces clés maintenant. Tu pourras toujours les revoir dans le tableau ensuite.
              </p>

              {createdKeys.map((k) => (
                <div key={k.id} className="space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                    {k.environment} — {k.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white p-2.5 rounded border border-emerald-300 font-mono text-xs font-bold text-slate-900 flex-1 break-all select-all">
                      {k.key}
                    </code>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(k.id, k.key)}
                      className="shrink-0 font-semibold"
                    >
                      {copiedKeyId === k.id ? 'Copiée !' : 'Copier'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setIsCreateModalOpen(false)}>Terminé</Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}