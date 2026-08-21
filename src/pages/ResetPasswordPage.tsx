import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { useResetPassword } from '@/hook/features/useUser';
import toast from 'react-hot-toast';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error('Lien invalide, redemandez un email de réinitialisation.');
      return;
    }

    resetPassword(
      { token, email, password, password_confirmation },
      {
        onSuccess: () => {
          toast.success('Mot de passe réinitialisé, vous pouvez vous connecter.');
          navigate('/login');
        },
        onError: (err: any) => {
          const validationErrors = err?.response?.data?.errors;
          if (validationErrors) {
            Object.values(validationErrors).flat().forEach((m) => toast.error(m as string));
          } else {
            toast.error(err?.response?.data?.message ?? 'Lien invalide ou expiré.');
          }
        },
      }
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
          <p className="text-sm text-slate-500">Choisissez un nouveau mot de passe pour {email || 'votre compte'}.</p>
        </div>

        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={password_confirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full font-semibold h-11" disabled={isPending}>
                {isPending ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
