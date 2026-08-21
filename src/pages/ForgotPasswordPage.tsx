import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { useForgotPassword } from '@/hook/features/useUser';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    forgotPassword(email, {
      onSuccess: () => setSent(true),
      onError: () => toast.error('Une erreur est survenue, réessayez.'),
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
          <p className="text-sm text-slate-500">
            Entrez votre email, on vous envoie un lien pour le réinitialiser.
          </p>
        </div>

        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="pt-6">
            {sent ? (
              <div className="text-center space-y-3 py-4">
                <MailCheck className="h-10 w-10 mx-auto text-green-600" />
                <p className="text-sm text-slate-600">
                  Si un compte existe avec l'adresse <span className="font-semibold">{email}</span>,
                  un email vient de vous être envoyé avec les instructions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full font-semibold h-11" disabled={isPending}>
                  {isPending ? 'Envoi...' : 'Envoyer le lien'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
            <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
