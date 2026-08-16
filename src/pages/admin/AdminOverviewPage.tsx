import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  Smartphone,
  PieChart,
  Plus,
  Battery,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Progress } from '../../components/ui/progress';
import { useMe } from '../../hook/features/useUser';
import { useAllDevice } from '../../hook/features/useDevice';
import { useCurrentSubscription } from '../../hook/features/useSubscribe';
import { useSmsHistory } from '../../hook/features/useSmsMessage';
import type { SmsMessage } from '../../type/smsMessage';

const WEEKDAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function AdminOverviewPage() {
  const { data: user } = useMe();
  const { data: devices = [] } = useAllDevice();
  const { data: subscription } = useCurrentSubscription();
  // ⚠️ Pas de pagination/filtre date côté backend sur cet endpoint pour l'instant :
  // on récupère tout l'historique de l'utilisateur et on calcule les stats ici.
  // Pour un très gros volume, il vaudra mieux déplacer ces agrégats côté API.
  const { data: smsHistory = [] } = useSmsHistory();

  const devicesTotal = devices.length;
  const devicesOnline = devices.filter((d) => d.status === 'online').length;
  const devicesOnlinePercent = devicesTotal > 0 ? Math.round((devicesOnline / devicesTotal) * 100) : 0;
  const offlineDevices = devices.filter((d) => d.status !== 'online');

  const plan = subscription?.plan;
  const smsUsed = subscription?.sms_used ?? 0;
  const smsQuota = plan?.sms_quota_monthly ?? 0;
  const smsRemaining = Math.max(0, smsQuota - smsUsed);
  const quotaPercent = smsQuota > 0 ? Math.min(100, Math.round((smsUsed / smsQuota) * 100)) : 0;

  const recentLogs = useMemo(() => smsHistory.slice(0, 5), [smsHistory]);

  // Taux de livraison : parmi les SMS ayant atteint un statut final (sent/delivered/failed)
  // ce mois-ci, proportion qui ne sont PAS en échec.
  const { deliveryRate, finalizedCount, failedCount } = useMemo(() => {
    const now = new Date();
    const finalized = smsHistory.filter((sms) => {
      const createdAt = new Date(sms.created_at);
      return (
        ['sent', 'delivered', 'failed'].includes(sms.status) &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    });
    const failed = finalized.filter((sms) => sms.status === 'failed').length;
    return {
      deliveryRate: finalized.length > 0 ? Math.round(((finalized.length - failed) / finalized.length) * 100 * 10) / 10 : null,
      finalizedCount: finalized.length,
      failedCount: failed,
    };
  }, [smsHistory]);

  // Volume quotidien sur les 7 derniers jours (tous statuts confondus)
  const dailyVolume = useMemo(() => {
    const days: { key: string; day: string; val: number; active: boolean }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      days.push({
        key,
        day: isToday ? `${WEEKDAY_LABELS[d.getDay()]} (Aujourd'hui)` : WEEKDAY_LABELS[d.getDay()],
        val: 0,
        active: isToday,
      });
    }

    smsHistory.forEach((sms: SmsMessage) => {
      const key = sms.created_at.slice(0, 10);
      const bucket = days.find((d) => d.key === key);
      if (bucket) bucket.val += 1;
    });

    return days;
  }, [smsHistory]);

  const maxDailyVal = Math.max(1, ...dailyVolume.map((d) => d.val));
  const avgDailyVal = Math.round(dailyVolume.reduce((sum, d) => sum + d.val, 0) / dailyVolume.length);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Livré</Badge>;
      case 'sent':
        return <Badge variant="default">Envoyé</Badge>;
      case 'pending':
      case 'queued':
        return <Badge variant="warning" className="font-medium">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-md">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">
            Bienvenue, {user?.organisation?.name ?? user?.name} 👋
          </h2>
          <p className="text-xs text-slate-300">
            {devicesTotal > 0
              ? `Votre passerelle SMS Android est active. ${devicesOnline} téléphone${devicesOnline > 1 ? 's' : ''} prêt${devicesOnline > 1 ? 's' : ''} à expédier des messages.`
              : "Aucun téléphone appairé pour l'instant. Ajoutez un device pour commencer à envoyer des SMS."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/admin/devices">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-1.5">
              <Plus className="h-4 w-4" />
              Ajouter un Device
            </Button>
          </Link>
          <Link to="/docs">
            <Button size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white">
              Doc API
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>SMS envoyés ce mois</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Send className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{smsUsed.toLocaleString('fr-FR')}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {smsQuota > 0 ? `Quota mensuel : ${smsQuota.toLocaleString('fr-FR')} SMS` : 'Aucun abonnement actif'}
            </p>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Taux de livraison</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {deliveryRate !== null ? `${deliveryRate} %` : '—'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {finalizedCount > 0
                ? `${failedCount} échec${failedCount > 1 ? 's' : ''} sur ${finalizedCount} SMS finalisés ce mois-ci`
                : 'Aucun SMS finalisé ce mois-ci pour le moment'}
            </p>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Devices en ligne</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Smartphone className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{devicesOnline} / {devicesTotal}</span>
              {devicesTotal > 0 && (
                <span className="text-xs text-emerald-600 font-bold">{devicesOnlinePercent}% dispo</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {offlineDevices.length > 0
                ? `${offlineDevices.length} appareil${offlineDevices.length > 1 ? 's' : ''} hors ligne${offlineDevices[0]?.name ? ` (${offlineDevices[0].name}${offlineDevices.length > 1 ? '...' : ''})` : ''}`
                : devicesTotal > 0
                  ? 'Tous les appareils sont en ligne'
                  : 'Aucun appareil appairé'}
            </p>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="hover:shadow-xs transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Quota restant</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <PieChart className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{smsRemaining.toLocaleString('fr-FR')}</span>
              <span className="text-xs text-slate-500">SMS</span>
            </div>
            <Progress value={quotaPercent} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Grid Charts & Recent Devices Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Volume Bar chart (données réelles, 7 derniers jours) */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Activité des 7 derniers jours</CardTitle>
              <CardDescription className="text-xs">Volume de SMS expédiés quotidiennement</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Moyenne : {avgDailyVal} SMS/jour
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
              {dailyVolume.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      item.active ? 'bg-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-slate-200 group-hover:bg-indigo-300'
                    }`}
                    style={{ height: `${Math.max(4, (item.val / maxDailyVal) * 100)}%` }}
                  />
                  <span className="text-[11px] font-medium text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Device Health Card (données réelles) */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">État des Téléphones</CardTitle>
              <Link to="/admin/devices" className="text-xs text-indigo-600 hover:underline font-semibold">
                Voir tout ({devicesTotal})
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {devicesTotal === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                Aucun téléphone appairé pour l'instant.
              </p>
            )}
            {devices.slice(0, 4).map((dev) => (
              <div key={dev.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      dev.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-slate-800 truncate max-w-[130px]">{dev.name}</p>
                    <p className="text-[10px] text-slate-500">{dev.sims?.[0]?.operator || 'Pas de SIM'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="flex items-center gap-0.5 font-mono text-[11px]">
                    <Battery className="h-3.5 w-3.5 text-slate-400" />
                    {dev.battery_level != null ? `${dev.battery_level}%` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent SMS Table (données réelles) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold">Derniers SMS Traités</CardTitle>
            <CardDescription className="text-xs">Flux d'envoi en direct à travers vos passerelles</CardDescription>
          </div>
          <Link to="/admin/sms-logs">
            <Button variant="outline" size="sm" className="text-xs">
              Voir tous les SMS
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">Aucun SMS envoyé pour l'instant.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID & Date</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead className="max-w-[280px]">Message</TableHead>
                  <TableHead>Passerelle SIM</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-slate-600">
                      <span className="font-semibold text-slate-900 block">{log.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.created_at).toLocaleString('fr-FR')}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-slate-800">{log.recipient}</TableCell>
                    <TableCell className="text-xs text-slate-600 truncate max-w-[280px]">{log.content}</TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {log.device_sim?.device ? (
                        <>
                          <span className="font-medium text-slate-800 block">{log.device_sim.device.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {log.device_sim.operator || 'Opérateur inconnu'} (SIM {log.device_sim.slot_index})
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
