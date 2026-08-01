import React, { useEffect, useState } from 'react';
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
  Sliders,
  Edit2, 
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/table';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { useAllDevice, useGeneratePairingCode, useRenameDevice, useDeleteDevice } from '@/hook/features/useDevice';
import type { Device } from '@/type/device';
import { useCurrentSubscription } from '@/hook/features/useSubscribe';


export function AdminDevicesPage() {
  const {data: devices=[], isLoading} = useAllDevice()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { mutate: renameDevice, isPending: isRenaming } = useRenameDevice();
  const { mutate: deleteDevice, isPending: isDeleting } = useDeleteDevice();
  const {data: current} = useCurrentSubscription()

  const [deviceToRename, setDeviceToRename] = useState<Device | null>(null);
  const [newName, setNewName] = useState('');
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const {
    mutate: generatePairingCode,
    data: pairingData,
    isPending: isGenerating,
    reset: resetPairingCode
  } = useGeneratePairingCode()

  // Génère un code dès l'ouverture du modal
  useEffect(() => {
    if (isAddModalOpen) {
      generatePairingCode(undefined, {
        onSuccess: (data) => {
          setSecondsLeft(data.expires_in);
        },
      });
    } else {
      resetPairingCode();
    }
  }, [isAddModalOpen]);

  // Compte à rebours d'expiration (10 min)
  useEffect(() => {
    if (!pairingData || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [pairingData, secondsLeft > 0]);

 

  const handleCopyKey = () => {
    if (!pairingData) return;
    navigator.clipboard.writeText(pairingData.pairing_token);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerate = () => {
    generatePairingCode(undefined, {
      onSuccess: (data) => {
        setSecondsLeft(data.expires_in);
      },
    });
  };

  const handleOpenRename = (device: Device) => {
    setDeviceToRename(device);
    setNewName(device.name);
  };

  const handleConfirmRename = () => {
    if (!deviceToRename || !newName.trim()) return;
    renameDevice(
      { id: deviceToRename.id, name: newName.trim() },
      { onSuccess: () => setDeviceToRename(null) }
    );
  };

  const handleConfirmDelete = () => {
    if (!deviceToDelete) return;
    deleteDevice(deviceToDelete.id, { onSuccess: () => setDeviceToDelete(null) });
  };

  const isExpired = pairingData && secondsLeft <= 0;

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

  const formatLastSeen = (isoDate: string | null) => {
    if (!isoDate) return '—';
    const date = new Date(isoDate);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
              {devices.map((dev) => {

                const smsSentToday = dev.sims?.reduce((sum, s) => sum + s.sent_today, 0) ?? 0;
                const smsLimitDaily = dev.sims?.reduce((sum, s) => sum + s.daily_quota, 0) ?? 0;

                return (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{dev.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {dev.android_device_id} 
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(dev.status)}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                            <Battery
                              className={`h-4 w-4 ${
                                dev.battery_level != null && dev.battery_level < 20
                                  ? 'text-red-500'
                                  : 'text-slate-500'
                              }`}
                            />
                            <span>{dev.battery_level != null ? `${dev.battery_level}%` : '—'}</span>
                          </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5">
                        {dev.sims?.map((sim) => (
                          <div key={sim.slot_index} className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              SIM {sim.slot_index + 1}
                            </span>
                            <span className="font-medium text-slate-800">{sim.operator}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({sim.phone_number})</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{smsSentToday} SMS</span>
                          <span className="text-slate-400 text-[10px]">{smsLimitDaily} max</span>
                        </div>
                        <div className="w-28 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{
                              width: `${
                                smsLimitDaily > 0
                                  ? Math.min(100, (smsSentToday / Number(current?.plan?.sms_quota_monthly)) * 100)
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-500">{formatLastSeen(dev.last_seen_at)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleOpenRename(dev)}
                        >
                          <Edit2 className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setDeviceToDelete(dev)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
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
            {isGenerating && (
              <div className="h-44 w-44 flex items-center justify-center text-slate-400 text-xs">
                Génération du QR code...
              </div>
            )}

            {!isGenerating && pairingData && !isExpired && (
              <div className="h-44 w-44 bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                <QRCodeSVG value={pairingData.qr_payload} size={152} />
              </div>
            )}

            {!isGenerating && isExpired && (
              <div className="h-44 w-44 flex flex-col items-center justify-center gap-2 text-center px-4">
                <p className="text-xs text-slate-500">Ce code a expiré.</p>
                <Button size="sm" variant="outline" onClick={handleRegenerate} className="gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regénérer un code
                </Button>
              </div>
            )}

            {pairingData && !isExpired && (
              <>
                <p className="mt-3 text-[10px] text-slate-400">
                  Expire dans <span className="font-semibold text-slate-600">{formatTime(secondsLeft)}</span>
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Clé d'association manuelle :</span>
                  <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono font-bold text-slate-800">
                    {pairingData.pairing_token}
                  </code>
                  <button
                    onClick={handleCopyKey}
                    className="text-slate-500 hover:text-indigo-600 p-1 rounded cursor-pointer"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Fermer
          </Button>
          <Button onClick={() => setIsAddModalOpen(false)}>J'ai scanné le QR Code</Button>
        </DialogFooter>
      </Dialog>

      {/* Modal renommer */}
      <Dialog open={!!deviceToRename} onOpenChange={(open) => !open && setDeviceToRename(null)}>
        <DialogClose onClick={() => setDeviceToRename(null)} />
        <DialogHeader>
          <DialogTitle>Renommer le téléphone</DialogTitle>
          <DialogDescription className="text-xs">
            Donne un nom clair pour retrouver facilement cet appareil.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ex: Téléphone Bureau"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeviceToRename(null)}>
            Annuler
          </Button>
          <Button onClick={handleConfirmRename} disabled={isRenaming || !newName.trim()}>
            {isRenaming ? 'Enregistrement...' : 'Renommer'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Confirmation suppression */}
      <AlertDialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce téléphone ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deviceToDelete?.name} » sera définitivement déconnecté. Il devra être réappairé (nouveau scan QR) pour être réutilisé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
