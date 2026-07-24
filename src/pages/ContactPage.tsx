import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('support');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="default" className="text-xs font-semibold">
          Contact & Support Technique
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Une question ? Discutons-en !
        </h1>
        <p className="text-slate-600 text-base">
          Notre équipe d'ingénieurs et de conseillers est à votre disposition pour vous accompagner dans l'intégration de votre passerelle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="shadow-lg border-slate-200/80">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Envoyez-nous un message</CardTitle>
              <CardDescription className="text-xs">
                Réponse garantie sous 24 heures ouvrées
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in-0">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-emerald-950">Message transmis avec succès !</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                      Merci de nous avoir contactés. Votre demande a été transmise à notre équipe support. Nous vous répondrons par e-mail dans les plus brefs délais.
                    </p>
                  </div>
                  <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm" className="mt-2 border-emerald-300 text-emerald-800">
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Votre Nom Complet</label>
                      <Input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jean Dupont"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Adresse E-mail</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean@entreprise.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Sujet de votre demande</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="support">Support Technique & Intégration API</option>
                      <option value="sales">Question Commerciale & Sur-mesure</option>
                      <option value="billing">Facturation & Abonnements</option>
                      <option value="partnership">Partenariat & Devenez Revendeur</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Message</label>
                    <Textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez votre besoin ou votre projet en détail..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full font-semibold h-11" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    <Send className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                Coordonnées Directes
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">E-mail Direct Support</span>
                  <a href="mailto:contact@smspasserelle.io" className="font-semibold text-white hover:underline">
                    contact@smspasserelle.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Ligne Téléphonique Business</span>
                  <span className="font-semibold text-white">+33 1 40 50 60 70</span>
                  <span className="text-[11px] text-slate-400 block">(Du Lundi au Vendredi, 9h-18h)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Siège Social</span>
                  <span className="font-medium text-white">42 Avenue des Champs-Élysées</span>
                  <span className="text-[11px] text-slate-400 block">75008 Paris, France</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Statut du Réseau :</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  99.98% Opérationnel
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
