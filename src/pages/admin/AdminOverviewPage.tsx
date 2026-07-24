import React from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  Smartphone,
  PieChart,
  ArrowUpRight,
  Plus,
  RefreshCcw,
  Activity,
  Battery,
  Wifi
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Progress } from '../../components/ui/progress';
import { MOCK_SMS_LOGS, MOCK_DEVICES } from '../../data/mockData';

export function AdminOverviewPage() {
  const recentLogs = MOCK_SMS_LOGS.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Livré</Badge>;
      case 'sent':
        return <Badge variant="default">Envoyé</Badge>;
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
          <h2 className="text-xl font-bold tracking-tight">Bienvenue, Acme Technologies 👋</h2>
          <p className="text-xs text-slate-300">
            Votre passerelle SMS Android est active. 4 téléphones sont prêts à expédier des messages.
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
              <span className="text-2xl font-black text-slate-900">14 280</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                +18% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Quota mensuel : 20 000 SMS</p>
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
              <span className="text-2xl font-black text-slate-900">99.4 %</span>
              <span className="text-xs text-slate-500 font-medium">SLA Respecté</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Seulement 0.6% de rejets GSM</p>
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
              <span className="text-2xl font-black text-slate-900">4 / 5</span>
              <span className="text-xs text-emerald-600 font-bold">80% dispo</span>
            </div>
            <p className="text-[11px] text-slate-400">1 appareil hors ligne (Moto G84)</p>
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
              <span className="text-2xl font-black text-slate-900">5 720</span>
              <span className="text-xs text-slate-500">SMS</span>
            </div>
            <Progress value={71} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Grid Charts & Recent Devices Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Volume Bar chart simulation */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Activité des 7 derniers jours</CardTitle>
              <CardDescription className="text-xs">Volume de SMS expédiés quotidiennement</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Moyenne: 816 SMS/jour
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
              {[
                { day: 'Lun', val: 780 },
                { day: 'Mar', val: 920 },
                { day: 'Mer', val: 650 },
                { day: 'Jeu', val: 1050 },
                { day: 'Ven', val: 890 },
                { day: 'Sam', val: 420 },
                { day: 'Dim (Aujourd’hui)', val: 816, active: true },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      item.active ? 'bg-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-slate-200 group-hover:bg-indigo-300'
                    }`}
                    style={{ height: `${(item.val / 1100) * 100}%` }}
                  />
                  <span className="text-[11px] font-medium text-slate-500">{item.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Device Health Card */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">État des Téléphones</CardTitle>
              <Link to="/admin/devices" className="text-xs text-indigo-600 hover:underline font-semibold">
                Voir tout ({MOCK_DEVICES.length})
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {MOCK_DEVICES.slice(0, 4).map((dev) => (
              <div key={dev.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      dev.status === 'online' ? 'bg-emerald-500' : dev.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-slate-800 truncate max-w-[130px]">{dev.name}</p>
                    <p className="text-[10px] text-slate-500">{dev.sims[0]?.carrier || 'No SIM'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span className="flex items-center gap-0.5 font-mono text-[11px]">
                    <Battery className="h-3.5 w-3.5 text-slate-400" />
                    {dev.batteryLevel}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent SMS Table */}
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
                    <span className="text-[10px] text-slate-400">{log.createdAt}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-slate-800">{log.recipient}</TableCell>
                  <TableCell className="text-xs text-slate-600 truncate max-w-[280px]">{log.message}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <span className="font-medium text-slate-800 block">{log.deviceName}</span>
                    <span className="text-[10px] text-slate-400">{log.carrier} (SIM {log.simSlot})</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
