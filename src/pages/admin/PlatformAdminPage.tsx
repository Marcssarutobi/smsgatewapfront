import React, { useState } from 'react';
import {
  Users,
  Smartphone,
  Send,
  Wallet,
  UserPlus,
  Globe2,
  MousePointerClick,
  AlertTriangle,
  Pencil,
  Plus,
  Ban,
  Mail,
  MailOpen,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { usePlatformDashboard, usePlatformAnalytics } from '../../services/platformAdminService';
import { useAdminPlans, useCreatePlan, useUpdatePlan, useDeactivatePlan } from '../../hook/features/useAdminPlans';
import { useAdminContactMessages, useMarkContactMessageRead } from '../../hook/features/useAdminContactMessages';
import { Plan } from '../../type/plan';
import toast from 'react-hot-toast';

// Formate une date GA4 (format brut "YYYYMMDD") en jour/mois lisible
function formatGaDate(raw: string) {
  if (raw.length !== 8) return raw;
  const day = raw.slice(6, 8);
  const month = raw.slice(4, 6);
  return `${day}/${month}`;
}

function StatCard({
  icon: Icon, label, value, hint,
}: { icon: React.ElementType; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          {hint && <p className="text-xs text-slate-400">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlatformAdminPage() {
  const [days, setDays] = useState(30);
  const { data: stats, isLoading: statsLoading } = usePlatformDashboard();
  const { data: analytics, isLoading: analyticsLoading } = usePlatformAnalytics(days);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Panneau super-admin</h1>
        <p className="text-sm text-slate-500">Vue d'ensemble de la plateforme, tous comptes confondus.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="plans">Tarifs</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
      {/* Stats globales de la plateforme */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Utilisateurs"
          value={statsLoading ? '—' : stats?.users.total ?? 0}
          hint={statsLoading ? undefined : `+${stats?.users.new_this_month ?? 0} ce mois-ci`}
        />
        <StatCard
          icon={Smartphone}
          label="Téléphones en ligne"
          value={statsLoading ? '—' : `${stats?.devices.online ?? 0} / ${stats?.devices.total ?? 0}`}
        />
        <StatCard
          icon={Send}
          label="SMS ce mois-ci"
          value={statsLoading ? '—' : stats?.sms.this_month ?? 0}
          hint={statsLoading ? undefined : `${stats?.sms.failed_this_month ?? 0} échoués`}
        />
        <StatCard
          icon={Wallet}
          label="Revenu ce mois-ci"
          value={statsLoading ? '—' : `${(stats?.revenue_this_month ?? 0).toLocaleString()} FCFA`}
        />
      </div>

      {/* Répartition des abonnements + derniers inscrits */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Abonnements actifs par plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats && Object.entries(stats.subscriptions_by_plan).length > 0 ? (
              Object.entries(stats.subscriptions_by_plan).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{plan}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Aucun abonnement actif.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="h-4 w-4" /> Derniers inscrits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscrit le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.latest_signups.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-slate-500">{u.email}</TableCell>
                    <TableCell><Badge variant="outline">{u.status}</Badge></TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Google Analytics */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Trafic du site (Google Analytics)</h2>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                days === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>

      {!analyticsLoading && analytics && !analytics.configured && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Google Analytics n'est pas encore configuré</p>
              <p className="text-sm text-amber-700">{analytics.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!analyticsLoading && analytics?.configured && analytics.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">Erreur lors de la récupération des statistiques</p>
              <p className="text-sm text-red-700">{analytics.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {analytics?.configured && !analytics.error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Visiteurs" value={analytics.totals?.active_users ?? 0} />
            <StatCard icon={Globe2} label="Sessions" value={analytics.totals?.sessions ?? 0} />
            <StatCard icon={MousePointerClick} label="Pages vues" value={analytics.totals?.page_views ?? 0} />
            <StatCard icon={MousePointerClick} label="Clics (événements)" value={analytics.totals?.clicks ?? 0} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visites dans le temps</CardTitle>
              <CardDescription>Sessions et visiteurs actifs, jour par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.by_date ?? []}>
                    <defs>
                      <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickFormatter={formatGaDate} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip labelFormatter={formatGaDate} />
                    <Area type="monotone" dataKey="sessions" stroke="#4F46E5" fill="url(#sessionsGradient)" name="Sessions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe2 className="h-4 w-4" /> Visiteurs par pays
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pays</TableHead>
                    <TableHead className="text-right">Visiteurs actifs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(analytics.by_country ?? []).map((row) => (
                    <TableRow key={row.country}>
                      <TableCell>{row.country}</TableCell>
                      <TableCell className="text-right font-medium">{row.active_users}</TableCell>
                    </TableRow>
                  ))}
                  {(analytics.by_country ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="py-6 text-center text-sm text-slate-400">
                        Aucune donnée sur cette période.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
          </div>
        </TabsContent>

        <TabsContent value="plans">
          <PlansManagementTab />
        </TabsContent>

        <TabsContent value="messages">
          <ContactMessagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet Tarifs : liste des plans (actifs et désactivés) + création/édition
// ---------------------------------------------------------------------------
const emptyPlanForm = { name: '', price: '', currency: 'XOF', sms_quota_monthly: '', max_devices: '' };

function PlansManagementTab() {
  const { data: plans, isLoading } = useAdminPlans();
  const { mutate: createPlan, isPending: isCreating } = useCreatePlan();
  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan();
  const { mutate: deactivatePlan } = useDeactivatePlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyPlanForm);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyPlanForm);
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      sms_quota_monthly: String(plan.sms_quota_monthly),
      max_devices: String(plan.max_devices),
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      price: Number(form.price),
      currency: form.currency,
      sms_quota_monthly: Number(form.sms_quota_monthly),
      max_devices: Number(form.max_devices),
    };

    const onSuccess = () => {
      toast.success(editingPlan ? 'Plan mis à jour' : 'Plan créé');
      setDialogOpen(false);
    };
    const onError = (err: any) => {
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).flat().forEach((m) => toast.error(m as string));
      } else {
        toast.error('Une erreur est survenue.');
      }
    };

    if (editingPlan) {
      updatePlan({ id: editingPlan.id, ...payload }, { onSuccess, onError });
    } else {
      createPlan(payload, { onSuccess, onError });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="font-semibold">
          <Plus className="h-4 w-4 mr-1.5" /> Nouveau plan
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Quota SMS/mois</TableHead>
                <TableHead>Devices max</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-slate-400">
                    Chargement...
                  </TableCell>
                </TableRow>
              )}
              {plans?.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{Number(plan.price).toLocaleString('fr-FR')} {plan.currency}</TableCell>
                  <TableCell>{plan.sms_quota_monthly.toLocaleString('fr-FR')}</TableCell>
                  <TableCell>{plan.max_devices}</TableCell>
                  <TableCell>
                    <Badge variant={plan.active ? 'success' : 'secondary'}>
                      {plan.active ? 'Actif' : 'Désactivé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(plan)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    {plan.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700"
                        onClick={() => {
                          if (confirm(`Désactiver le plan "${plan.name}" ? Il ne sera plus proposé sur la landing page, mais restera valide pour les abonnés existants.`)) {
                            deactivatePlan(plan.id, { onSuccess: () => toast.success('Plan désactivé') });
                          }
                        }}
                      >
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingPlan ? `Modifier le plan ${editingPlan.name}` : 'Nouveau plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? 'Les abonnés déjà sur ce plan ne sont pas affectés rétroactivement pour leur période en cours.'
                : 'Ce plan apparaîtra sur la landing page dès sa création.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nom du plan</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Prix (FCFA)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Quota SMS/mois</label>
                <Input
                  type="number"
                  min={0}
                  value={form.sms_quota_monthly}
                  onChange={(e) => setForm({ ...form, sms_quota_monthly: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nombre de devices max</label>
              <Input
                type="number"
                min={1}
                value={form.max_devices}
                onChange={(e) => setForm({ ...form, max_devices: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose onClick={() => setDialogOpen(false)} />
            <Button type="submit" disabled={isCreating || isUpdating} className="font-semibold">
              {editingPlan ? 'Enregistrer' : 'Créer le plan'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet Messages : messages reçus via le formulaire /contact du site
// ---------------------------------------------------------------------------
function ContactMessagesTab() {
  const { data, isLoading } = useAdminContactMessages();
  const { mutate: markRead } = useMarkContactMessageRead();

  if (isLoading) {
    return <p className="text-sm text-slate-500 py-6">Chargement...</p>;
  }

  return (
    <div className="space-y-3">
      {(!data || data.data.length === 0) && (
        <p className="text-sm text-slate-400 py-6 text-center">Aucun message reçu pour le moment.</p>
      )}

      {data?.data.map((msg) => (
        <Card key={msg.id} className={!msg.read_at ? 'border-indigo-200 bg-indigo-50/40' : ''}>
          <CardContent className="pt-6 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{msg.name} <span className="font-normal text-slate-400">— {msg.email}</span></p>
                <p className="text-xs text-slate-500">{msg.subject} · {new Date(msg.created_at).toLocaleString('fr-FR')}</p>
              </div>
              {!msg.read_at && (
                <Button variant="ghost" size="sm" onClick={() => markRead(msg.id)}>
                  <MailOpen className="h-3.5 w-3.5 mr-1.5" /> Marquer comme lu
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
