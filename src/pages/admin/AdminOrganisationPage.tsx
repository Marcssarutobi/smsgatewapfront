import React, { useState } from 'react';
import { Building2, Save, CheckCircle2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { MOCK_ORGANISATION } from '../../data/mockData';

export function AdminOrganisationPage() {
  const [formData, setFormData] = useState(MOCK_ORGANISATION);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Paramètres de l'Organisation</h2>
        <p className="text-xs text-slate-500">
          Mettez à jour la raison sociale, les coordonnées et la signature par défaut de vos SMS.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Les modifications de votre organisation ont été enregistrées avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Informations Générales</CardTitle>
            <CardDescription className="text-xs">Identité légale et coordonnées de contact</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nom de l'entreprise / Organisation</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Adresse e-mail administrative</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Téléphone de contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Fuseau Horaire par défaut</label>
                <Input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Adresse Siège Social</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Signature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Signature SMS & Paramètres d'Envoi</CardTitle>
            <CardDescription className="text-xs">Personnalisez la fin des messages expédiés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Signature SMS par défaut (optionnel)</label>
              <Input
                type="text"
                value={formData.smsSignature}
                onChange={(e) => setFormData({ ...formData, smsSignature: e.target.value })}
                placeholder="Ex: - Envoyé via Acme"
              />
              <p className="text-[11px] text-slate-400">
                Sera automatiquement ajoutée à la fin de vos SMS si l'option `append_signature` est activée dans vos appels API.
              </p>
            </div>
          </CardContent>

          <CardFooter className="justify-end border-t border-slate-100 pt-4">
            <Button type="submit" className="font-semibold gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les modifications
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
