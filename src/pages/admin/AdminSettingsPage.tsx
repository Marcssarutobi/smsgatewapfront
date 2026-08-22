import React, { useEffect, useState } from 'react';
import { User as UserIcon, Lock, ShieldCheck, Save, CheckCircle2, Copy, Check, ShieldOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullCode = code.join('');

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    confirm(fullCode, {
      onError: () => {
        toast.error('Code invalide, réessayez.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      },
    });
  };

  const copySecret = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.secret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const copyRecoveryCodes = () => {
    if (!confirmData) return;
    navigator.clipboard.writeText(confirmData.recovery_codes.join('\n'));
    setCopiedCodes(true);
    toast.success('Codes de récupération copiés');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  // Étape "codes de récupération" — même grammaire visuelle que la révélation
  // de clés API fraîchement générées (bloc emerald, mono, select-all).
  if (confirmData) {
    return (
      <Card className="border-slate-200/80">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="h-5 w-5" /> Double authentification activée
          </CardTitle>
          <CardDescription>
            Conservez ces codes de récupération dans un endroit sûr : ils permettent de vous reconnecter
            si vous perdez l'accès à votre application d'authentification. Chaque code n'est utilisable qu'une fois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              8 codes de récupération générés
            </p>
            <div className="grid grid-cols-2 gap-2 bg-white rounded-lg border border-emerald-300 p-3">
              {confirmData.recovery_codes.map((c) => (
                <code key={c} className="font-mono text-xs font-bold text-slate-900 select-all">
                  {c}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t border-slate-100 pt-4">
          <Button onClick={copyRecoveryCodes} className="font-semibold">
            <Copy className="h-4 w-4 mr-1.5" /> {copiedCodes ? 'Copiés !' : 'Copier les codes'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">Activer la double authentification</CardTitle>
        <CardDescription>Deux étapes rapides pour sécuriser votre compte.</CardDescription>
      </CardHeader>

      {/* Stepper — même grammaire numérotée que le pairing d'un device (badges
          ronds indigo reliés par une ligne), pour rester cohérent avec le reste
          de l'app plutôt que d'inventer un nouveau langage visuel. */}
      <div className="flex items-center px-6 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
            1
          </span>
          <span className="text-xs font-semibold text-slate-700">Scanner</span>
        </div>
        <div className={`mx-3 h-px flex-1 ${fullCode.length === 6 ? 'bg-indigo-300' : 'bg-slate-200'}`} />
        <div className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              setupData ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
            }`}
          >
            2
          </span>
          <span className={`text-xs font-semibold ${setupData ? 'text-slate-700' : 'text-slate-400'}`}>
            Confirmer
          </span>
        </div>
      </div>

      <CardContent className="space-y-5">
        {isSettingUp && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400">
            <div className="h-44 w-44 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse" />
            <p className="text-xs">Génération du QR code...</p>
          </div>
        )}

        {setupData && (
          <>
            {/* QR box — même traitement que le modal de pairing device (fond
                slate-50, carte blanche arrondie avec ombre légère autour du QR). */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="h-44 w-44 bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                <div
                  className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: setupData.qr_code_svg }}
                />
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Scannez avec Google Authenticator, Authy ou une app compatible TOTP
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Ou entrez ce code manuellement :</span>
                <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono font-bold text-slate-800">
                  {setupData.secret}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="text-slate-500 hover:text-indigo-600 p-1 rounded cursor-pointer"
                >
                  {copiedSecret ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Code à 6 chiffres — mêmes cases individuelles que l'écran de
                connexion 2FA, pour unifier la saisie de code dans toute l'app. */}
            <form onSubmit={handleConfirm} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                    className="h-12 w-10 rounded-lg border border-slate-300 text-center text-lg font-bold text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors"
                  />
                ))}
              </div>
              <Button type="submit" disabled={isConfirming || fullCode.length !== 6} className="font-semibold w-full max-w-xs">
                {isConfirming ? 'Vérification...' : 'Activer la 2FA'}
              </Button>
            </form>
          </>
        )}
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
    <Card className="border-slate-200/80 overflow-hidden">
      {/* Bandeau de statut — même ton que la bannière de bienvenue du dashboard
          (fond sombre dégradé), pour signaler visuellement que c'est un état
          "protégé" plutôt qu'un simple formulaire. */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-emerald-950 px-6 py-5 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold">Double authentification activée</p>
          <p className="text-xs text-slate-300">Un code à 6 chiffres est demandé à chaque connexion.</p>
        </div>
        <Badge variant="success" className="ml-auto shrink-0">Protégé</Badge>
      </div>

      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-1.5 text-slate-700">
            <ShieldOff className="h-4 w-4" /> Désactiver la protection
          </CardTitle>
          <CardDescription>
            Confirmez votre mot de passe pour désactiver la 2FA. Vos codes de récupération actuels seront invalidés.
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
