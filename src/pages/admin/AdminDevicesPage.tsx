import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  QrCode,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { MOCK_DEVICES } from '../../data/mockData';
import { AndroidDevice } from '../../types';

export function AdminDevicesPage() {
  const [devices, setDevices] = useState<AndroidDevice[]>(MOCK_DEVICES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const pairingKey = 'GW-PAIR-9841-3A2B';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pairingKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="success" className="gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            En ligne
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="warning" className="gap-1">
            Occupé
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="secondary" className="gap-1 text-slate-500">
            Hors ligne
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestion des Téléphones Android</h2>
          <p className="text-xs text-slate-500">
            Supervisez la batterie, le réseau GSM et le statut de vos passerelles mobiles.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="font-semibold gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Ajouter un téléphone
        </Button>
      </div>

      {/* Main Devices Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Passerelles Connectées ({devices.length})</CardTitle>
          <CardDescription className="text-xs">
            Tous les appareils synchronisés avec votre compte SMS Gateway
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Téléphone & Modèle</TableHead>
                <TableHead>Statut & Batterie</TableHead>
                <TableHead>Cartes SIM & Réseau</TableHead>
                <TableHead>Volume Jour / Limite</TableHead>
                <TableHead>Dernier PCloud Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((dev) => (
                <TableRow key={dev.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{dev.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {dev.model} • {dev.androidVersion}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(dev.status)}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                        {dev.isPluggedIn ? (
                          <BatteryCharging className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Battery
                            className={`h-4 w-4 ${
                              dev.batteryLevel < 20 ? 'text-red-500' : 'text-slate-500'
                            }`}
                          />
                        )}
                        <span>{dev.batteryLevel}%</span>
                        {dev.isPluggedIn && <span className="text-[10px] text-emerald-600">(Secteur)</span>}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1.5">
                      {dev.sims.map((sim) => (
                        <div key={sim.slot} className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                            SIM {sim.slot}
                          </span>
                          <span className="font-medium text-slate-800">{sim.carrier}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({sim.phoneNumber})</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{dev.smsSentToday} SMS</span>
                        <span className="text-slate-400 text-[10px]">{dev.smsLimitDaily} max</span>
                      </div>
                      <div className="w-28 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (dev.smsSentToday / dev.smsLimitDaily) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500">{dev.lastSeen}</TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Dialog: QR Code pairing */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogClose onClick={() => setIsAddModalOpen(false)} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <QrCode className="h-5 w-5 text-indigo-600" />
            Connecter un nouveau téléphone Android
          </DialogTitle>
          <DialogDescription className="text-xs">
            Suivez les étapes ci-dessous pour transformer votre smartphone en passerelle SMS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* Steps list */}
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                1
              </span>
              <p>
                Téléchargez l’application APK <strong>SMS-Gateway-v1.4.apk</strong> sur votre appareil Android.
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                2
              </span>
              <p>Ouvrez l’application et autorisez la permission « Envoyer et lire les SMS ».</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700">
                3
              </span>
              <p>Scannez le QR Code ci-dessous avec la caméra de l’application pour synchroniser.</p>
            </div>
          </div>

          {/* QR Code Visual Box */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
            {/* SVG simulated QR Code */}
            <div className="h-44 w-44 bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" />

                <rect x="40" y="10" width="10" height="20" />
                <rect x="20" y="40" width="20" height="10" />
                <rect x="50" y="50" width="20" height="20" />
                <rect x="80" y="40" width="10" height="30" />
                <rect x="40" y="80" width="30" height="10" />
              </svg>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Clé d'association manuelle :</span>
              <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono font-bold text-slate-800">
                {pairingKey}
              </code>
              <button
                onClick={handleCopyKey}
                className="text-slate-500 hover:text-indigo-600 p-1 rounded cursor-pointer"
              >
                {copiedKey ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Fermer
          </Button>
          <Button onClick={() => setIsAddModalOpen(false)}>J'ai scanné le QR Code</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
