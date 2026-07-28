import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { useVerifyTwoFactor } from '@/hook/features/useUser';
import toast from 'react-hot-toast';

export function TwoFactorPage() {
  const [params] = useSearchParams();
  const tempToken = params.get('temp_token');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const { mutate: verify, isPending } = useVerifyTwoFactor();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempToken) {
      toast.error('Session expirée, reconnectez-vous.');
      navigate('/login');
      return;
    }

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Entrez les 6 chiffres du code.');
      return;
    }

    verify(fullCode, {
      onSuccess: () => {
        navigate('/admin');
      },
      onError: () => {
        toast.error('Code invalide, réessayez.');
      },
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Double Authentification 2FA</h1>
          <p className="text-sm text-slate-500">
            Entrez le code à 6 chiffres généré par votre application Authenticator.
          </p>
        </div>

        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="h-12 w-10 sm:w-12 text-center text-lg font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                ))}
              </div>

              <Button type="submit" className="w-full font-semibold h-11" disabled={isPending}>
                {isPending ? 'Vérification...' : 'Vérifier le code'}
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