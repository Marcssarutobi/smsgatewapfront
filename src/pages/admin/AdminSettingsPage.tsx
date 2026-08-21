import React, { useEffect, useState } from 'react';
import { User as UserIcon, Lock, ShieldCheck, Save, CheckCircle2, Copy, ShieldOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import {
  useMe,
  useUpdateProfile,
  useChangePassword,
  useSetupTwoFactor,
  useConfirmTwoFactor,
  useDisableTwoFactor,
} from '@/hook/features/useUser';
import toast from 'react-hot-toast';

export function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Paramètres du compte</h1>
        <p className="text-sm text-slate-500">Gérez votre profil, votre mot de passe et la sécurité de votre compte.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="h-4 w-4 mr-1.5 inline" /> Profil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="h-4 w-4 mr-1.5 inline" /> Mot de passe
          </TabsTrigger>
          <TabsTrigger value="2fa">
            <ShieldCheck className="h-4 w-4 mr-1.5 inline" /> Double authentification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="password">
          <PasswordTab />
        </TabsContent>
        <TabsContent value="2fa">
          <TwoFactorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Onglet Profil : nom, email, avatar (URL)
// ---------------------------------------------------------------------------
function ProfileTab() {
  const { data: user, isLoading } = useMe();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [form, setForm] = useState({ name: '', email: '', avatar: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? '', email: user.email ?? '', avatar: user.avatar ?? '' });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form, {
      onSuccess: () => {
        setSaved(true);
        toast.success('Profil mis à jour');
        setTimeout(() => setSaved(false), 3000);
      },
      onError: (err: any) => {
        const validationErrors = err?.response?.data?.errors;
        if (validationErrors) {
          Object.values(validationErrors).flat().forEach((m) => toast.error(m as string));
        } else {
          toast.error('Une erreur est survenue.');
        }
      },
    });
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500 py-6">Chargement du profil...</p>;
  }

  return (
    <Card className="border-slate-200/80">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-base">Informations personnelles</CardTitle>
          <CardDescription>Ces informations sont visibles dans votre espace admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Nom complet</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">URL de l'avatar (optionnel)</label>
            <Input
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between border-t border-slate-100 pt-4">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Enregistré
            </span>
          ) : <span />}
          <Button type="submit" disabled={isPending} className="font-semibold">
            <Save className="h-4 w-4 mr-1.5" />
            {isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Onglet Mot de passe : ancien + nouveau + confirmation
// ---------------------------------------------------------------------------
function PasswordTab() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const [form, setForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword(form, {
      onSuccess: () => {
        toast.success('Mot de passe mis à jour');
        setForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      },
      onError: (err: any) => {
        const validationErrors = err?.response?.data?.errors;
        if (validationErrors) {
          Object.values(validationErrors).flat().forEach((m) => toast.error(m as string));
        } else {
          toast.error(err?.response?.data?.message ?? 'Une erreur est survenue.');
        }
      },
    });
  };

  return (
    <Card className="border-slate-200/80">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-base">Changer le mot de passe</CardTitle>
          <CardDescription>Votre mot de passe actuel vous sera redemandé par sécurité.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Mot de passe actuel</label>
            <Input
              type="password"
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Nouveau mot de passe</label>
            <Input
              type="password"
              minLength={8}
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Confirmer le nouveau mot de passe</label>
            <Input
              type="password"
              minLength={8}
              value={form.new_password_confirmation}
              onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 pt-4">
          <Button type="submit" disabled={isPending} className="font-semibold">
            {isPending ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Onglet 2FA : état actif -> proposer désactivation ; état inactif -> setup + confirm
// ---------------------------------------------------------------------------
function TwoFactorTab() {
  const { data: user, isLoading } = useMe();
  const isEnabled = !!user?.two_factor_confirmed_at;

  if (isLoading) {
    return <p className="text-sm text-slate-500 py-6">Chargement...</p>;
  }

  return isEnabled ? <DisableTwoFactorCard /> : <EnableTwoFactorCard />;
}

function EnableTwoFactorCard() {
  const { mutate: setup, data: setupData, isPending: isSettingUp } = useSetupTwoFactor();
  const { mutate: confirm, isPending: isConfirming, data: confirmData } = useConfirmTwoFactor();
  const [code, setCode] = useState('');

  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    confirm(code, {
      onError: () => toast.error('Code invalide, réessayez.'),
    });
  };

  const copyRecoveryCodes = () => {
    if (!confirmData) return;
    navigator.clipboard.writeText(confirmData.recovery_codes.join('\n'));
    toast.success('Codes de récupération copiés');
  };

  if (confirmData) {
    return (
      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" /> 2FA activée
          </CardTitle>
          <CardDescription>
            Conservez ces codes de récupération dans un endroit sûr : ils permettent de vous reconnecter
            si vous perdez l'accès à votre application d'authentification. Chaque code n'est utilisable qu'une fois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg p-4">
            {confirmData.recovery_codes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={copyRecoveryCodes} className="font-semibold">
            <Copy className="h-4 w-4 mr-1.5" /> Copier les codes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80">
      <CardHeader>
        <CardTitle className="text-base">Activer la double authentification</CardTitle>
        <CardDescription>
          Scannez ce QR code avec Google Authenticator, Authy ou une app compatible TOTP, puis entrez le code généré.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSettingUp && <p className="text-sm text-slate-500">Génération du QR code...</p>}
        {setupData && (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-44 h-44 border border-slate-200 rounded-lg p-2 bg-white"
              dangerouslySetInnerHTML={{ __html: setupData.qr_code_svg }}
            />
            <p className="text-xs text-slate-500">
              Le QR code ne scanne pas ? Entrez ce code manuellement :{' '}
              <span className="font-mono font-semibold text-slate-700">{setupData.secret}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleConfirm} className="flex items-end gap-2 max-w-xs mx-auto">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Code à 6 chiffres</label>
            <Input
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>
          <Button type="submit" disabled={isConfirming || !setupData} className="font-semibold">
            {isConfirming ? 'Vérification...' : 'Activer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DisableTwoFactorCard() {
  const { mutate: disable, isPending } = useDisableTwoFactor();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    disable(password, {
      onSuccess: () => {
        toast.success('2FA désactivée');
        setPassword('');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Mot de passe incorrect.');
      },
    });
  };

  return (
    <Card className="border-slate-200/80">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <ShieldCheck className="h-5 w-5" /> Double authentification activée
          </CardTitle>
          <CardDescription>
            Votre compte est protégé par un code à 6 chiffres à chaque connexion. Confirmez votre mot de
            passe pour désactiver cette protection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 pt-4">
          <Button type="submit" variant="destructive" disabled={isPending} className="font-semibold">
            <ShieldOff className="h-4 w-4 mr-1.5" />
            {isPending ? 'Désactivation...' : 'Désactiver la 2FA'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
