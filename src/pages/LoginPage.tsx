import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { userService } from '@/services/userService';
import { useLogin } from '@/hook/features/useUser';
import { LoginTwoFactorPendingResponse } from '@/type/user';

function isTwoFactorPending(data: any): data is LoginTwoFactorPendingResponse {
  return data?.requires_2fa === true;
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {mutate:login, isPending, error} = useLogin()

  const handleGoogleLogin = async () => {
    const { url } = await userService.googleRedirect();
    setIsLoading(true)
    window.location.href = url;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login(
      {email,password},
      {
        onSuccess: (data)=>{
          if (isTwoFactorPending(data)) {
            navigate(`/2fa?temp_token=${data.temp_token}`);
            return;
          }
          navigate('/admin')
        },
        onError: (err: any) => {
          const validationErrors = err?.response?.data?.errors;

          if (validationErrors) {
            // affiche le premier message de chaque champ en erreur
            Object.values(validationErrors)
              .flat()
              .forEach((message) => toast.error(message as string));
          } else {
            toast.error('Une erreur est survenue, réessayez.');
          }
        }
      }
    )

    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(false);
    //   navigate('/2fa');
    // }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 font-bold text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SMS Gateway</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Connexion à votre espace</h1>
          <p className="text-sm text-slate-500">Accédez à vos téléphones et clés API</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-slate-200/80">
          <CardHeader className="space-y-1 pb-4">
            <Button
              variant="outline"
              type="button"
              className="w-full justify-center gap-2 font-medium text-slate-700 h-10"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {isLoading ? 'Vérification...' : 'Se connecter avec Google'}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">Ou avec un e-mail</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Adresse e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="nom@entreprise.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
                  <a href="#forgot" className="text-xs font-medium text-indigo-600 hover:underline">
                    Oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {error && <p>Identifiants incorrects</p>}

              <Button type="submit" className="w-full font-semibold h-11" disabled={isLoading}>
                {isPending ? 'Vérification...' : 'Se connecter'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
            Vous n'avez pas encore de compte ?{' '}
            <Link to="/register" className="ml-1 font-semibold text-indigo-600 hover:underline">
              Créer un compte
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
