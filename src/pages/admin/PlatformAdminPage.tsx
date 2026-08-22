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
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { usePlatformDashboard, usePlatformAnalytics } from '../../services/platformAdminService';

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
  );
}
