import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, MailCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';

const STATUS_CONTENT: Record<string, { icon: React.ReactNode; title: string; text: string }> = {
  success: {
    icon: <CheckCircle2 className="h-10 w-10 text-green-600" />,
    title: 'Email vérifié !',
    text: 'Votre adresse email est confirmée, vous pouvez profiter de toutes les fonctionnalités.',
  },
  already: {
    icon: <MailCheck className="h-10 w-10 text-indigo-600" />,
    title: 'Déjà vérifié',
    text: 'Cette adresse email était déjà confirmée.',
  },
  invalid: {
    icon: <XCircle className="h-10 w-10 text-red-600" />,
    title: 'Lien invalide',
    text: "Ce lien de vérification est invalide ou a expiré. Vous pouvez en redemander un depuis les paramètres de votre compte.",
  },
};

export function EmailVerifiedPage() {
  const [params] = useSearchParams();
  const status = params.get('status') ?? 'invalid';
  const content = STATUS_CONTENT[status] ?? STATUS_CONTENT.invalid;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="pt-8 pb-4 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center">{content.icon}</div>
            <h1 className="text-xl font-bold text-slate-900">{content.title}</h1>
            <p className="text-sm text-slate-500">{content.text}</p>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-4">
            <Link to="/admin">
              <Button className="font-semibold">Aller au tableau de bord</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
