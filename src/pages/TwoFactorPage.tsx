import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';

export function TwoFactorPage() {
  const [code, setCode] = useState(['8', '4', '9', '2', '0', '1']);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      navigate('/admin');
    }, 600);
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
            Un code à 6 chiffres a été envoyé à votre application Authenticator ou SMS.
          </p>
        </div>

        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="pt-6">
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    className="h-12 w-11 sm:w-12 rounded-xl border border-slate-300 text-center font-mono text-xl font-bold text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                ))}
              </div>

              <Button type="submit" className="w-full font-semibold h-11" disabled={isVerifying}>
                {isVerifying ? 'Vérification du code...' : 'Valider et accéder au Dashboard'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <button
              onClick={() => setCode(['', '', '', '', '', ''])}
              className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Renvoyer un nouveau code
            </button>
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Changer de compte
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
