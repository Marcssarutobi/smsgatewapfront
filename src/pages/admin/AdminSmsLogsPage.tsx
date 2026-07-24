import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCcw,
  Smartphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { MOCK_SMS_LOGS } from '../../data/mockData';
import { SmsLog } from '../../types';

export function AdminSmsLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const filteredLogs = MOCK_SMS_LOGS.filter((log) => {
    const matchesSearch =
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    setExportMessage('Exportation de 8 entrées au format CSV...');
    setTimeout(() => setExportMessage(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Livré</Badge>;
      case 'sent':
        return <Badge variant="default">Envoyé</Badge>;
      case 'queued':
        return <Badge variant="warning">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Historique des Envois SMS</h2>
          <p className="text-xs text-slate-500">
            Journal détaillé de tous les messages acheminés par l'API vers vos téléphones.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 font-semibold text-xs">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {exportMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          {exportMessage}
        </div>
      )}

      {/* Filters & Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher destinataire, contenu, ID..."
                className="pl-9 text-xs"
              />
            </div>

            {/* Status Tabs/Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'delivered', label: 'Livrés' },
                { id: 'sent', label: 'Envoyés' },
                { id: 'queued', label: 'En attente' },
                { id: 'failed', label: 'Échecs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedStatus === tab.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">
            Journaux d'envoi ({filteredLogs.length} messages)
          </CardTitle>
          <CardDescription className="text-xs">
            Affichage des résultats triés par date décroissante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Horodatage</TableHead>
                <TableHead>Numéro Destinataire</TableHead>
                <TableHead className="max-w-[320px]">Contenu du SMS</TableHead>
                <TableHead>Appareil & SIM</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    <span className="font-bold text-slate-900 block">{log.id}</span>
                    <span className="text-[10px] text-slate-400">{log.createdAt}</span>
                  </TableCell>

                  <TableCell className="font-mono text-xs font-bold text-slate-800">
                    {log.recipient}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 max-w-[320px] leading-relaxed">
                    <p className="line-clamp-2">{log.message}</p>
                    {log.errorMessage && (
                      <p className="text-[10px] text-red-600 font-medium mt-0.5">
                        Erreur: {log.errorMessage}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">{log.deviceName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block ml-5">
                      SIM {log.simSlot} ({log.carrier})
                    </span>
                  </TableCell>

                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))}

              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-slate-400">
                    Aucun SMS ne correspond à vos critères de recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>Affichage de 1 à {filteredLogs.length} sur {MOCK_SMS_LOGS.length} entrées</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0 font-bold">
                1
              </Button>
              <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
