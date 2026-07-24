import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { MOCK_API_KEYS } from '../../data/mockData';
import { ApiKey } from '../../types';

export function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const generated = `sk_live_new_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 10)}`;
    const newEntry: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: 'sk_live_new',
      keyMasked: `${generated.substring(0, 12)}••••••••••••${generated.substring(generated.length - 4)}`,
      fullKey: generated,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Jamais',
      permissions: ['sms.send', 'sms.read']
    };

    setKeys([newEntry, ...keys]);
    setCreatedKey(generated);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(
      keys.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestion des Clés API</h2>
          <p className="text-xs text-slate-500">
            Créez et gérez les clés d'accès nécessaires pour authentifier vos requêtes HTTP REST.
          </p>
        </div>
        <Button onClick={() => { setCreatedKey(null); setNewKeyName(''); setIsCreateModalOpen(true); }} className="font-semibold gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Générer une clé API
        </Button>
      </div>

      {/* Security Warning Box */}
      <Card className="bg-amber-50/60 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold">Consignes de Sécurité Importantes</p>
            <p className="text-amber-800 leading-relaxed">
              Vos clés API possèdent les privilèges d’envoi de SMS sur vos appareils. Ne partagez jamais vos clés privées dans du code client JavaScript public ou des répertoires Git publics.
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
                <TableHead>Clé Masquée</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Dernière Utilisation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-bold text-xs text-slate-900">{k.name}</TableCell>

                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-800 border border-slate-200">
                        {revealedKeyId === k.id && k.fullKey ? k.fullKey : k.keyMasked}
                      </span>
                      {k.fullKey && (
                        <button
                          onClick={() => setRevealedKeyId(revealedKeyId === k.id ? null : k.id)}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                        >
                          {revealedKeyId === k.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(k.id, k.fullKey || k.keyMasked)}
                        className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                      >
                        {copiedKeyId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {k.permissions.map((perm) => (
                        <span key={perm} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    {k.status === 'active' ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Révoquée</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">{k.createdAt}</TableCell>
                  <TableCell className="text-xs text-slate-500">{k.lastUsedAt}</TableCell>

                  <TableCell className="text-right">
                    {k.status === 'active' && (
                      <Button
                        onClick={() => handleRevokeKey(k.id)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Révoquer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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
            Créer une nouvelle clé API
          </DialogTitle>
          <DialogDescription className="text-xs">
            Donnez un nom explicite pour identifier l'application qui utilisera cette clé.
          </DialogDescription>
        </DialogHeader>

        {!createdKey ? (
          <form onSubmit={handleCreateKey} className="space-y-4 my-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nom / Utilisation de la clé</label>
              <Input
                type="text"
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Ex: Serveur Production - Backend Laravel"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="font-semibold">
                Générer la clé
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 my-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <Check className="h-4 w-4 text-emerald-600" />
                Clé API générée avec succès !
              </p>
              <p className="text-slate-600">
                Copiez cette clé maintenant. Pour des raisons de sécurité, vous ne pourrez plus la revoir en entier ultérieurement.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <code className="bg-white p-2.5 rounded border border-emerald-300 font-mono text-xs font-bold text-slate-900 flex-1 break-all select-all">
                  {createdKey}
                </code>
                <Button
                  size="sm"
                  onClick={() => handleCopy('modal_key', createdKey)}
                  className="shrink-0 font-semibold"
                >
                  {copiedKeyId === 'modal_key' ? 'Copiée !' : 'Copier'}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsCreateModalOpen(false)}>J'ai copié ma clé API</Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}
