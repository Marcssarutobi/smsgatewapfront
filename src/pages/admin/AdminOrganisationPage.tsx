import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, Mail as GlobeIcon, Phone, MapPin, Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useGetOrganisation, useUpdateOrganisation } from '@/hook/features/useOrganisation';

interface OrganisationForm {
  name: string;
  signature: string;
  website: string;
  phone: string;
  address: string;
  mtn_sender_address: string;
  mtn_country_code: string;
}

const EMPTY_FORM: OrganisationForm = {
  name: '',
  signature: '',
  website: '',
  phone: '',
  address: '',
  mtn_sender_address: '',
  mtn_country_code: '229',
};

export function AdminOrganisationPage() {
  const { data: organisation, isLoading } = useGetOrganisation();
  const { mutate: updateOrganisation, isPending } = useUpdateOrganisation();

  const [formData, setFormData] = useState<OrganisationForm>(EMPTY_FORM);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronise le formulaire dès que les données réelles arrivent
  // (ou reste vide si l'utilisateur n'a pas encore d'organisation)
  useEffect(() => {
    if (organisation) {
      setFormData({
        name: organisation.name ?? '',
        signature: organisation.signature ?? '',
        website: organisation.website ?? '',
        phone: organisation.phone ?? '',
        address: organisation.address ?? '',
        mtn_sender_address: organisation.mtn_sender_address ?? '',
        mtn_country_code: organisation.mtn_country_code ?? '229',
      });
    }
  }, [organisation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateOrganisation(formData, {
      onSuccess: () => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <p className="text-sm text-slate-500">Chargement des informations de l'organisation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nom de l'entreprise / Organisation</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-9"
                />
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
                <label className="text-xs font-semibold text-slate-700">Site Web</label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="pl-9"
                    placeholder="https://monentreprise.com"
                  />
                </div>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Radio className="h-4 w-4 text-indigo-600" />
              Mode d'envoi & Paramètres Réseau (MTN)
            </CardTitle>
            <CardDescription className="text-xs">
              Mode actuel :{' '}
              <span className="font-semibold text-slate-700">
                {organisation?.preferred_sms_channel === 'network' ? 'Réseau (MTN)' : 'Téléphone (Device)'}
              </span>
              {' '}— pour changer de mode, souscrivez un nouveau plan depuis la page Abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nom d'expéditeur (senderAddress)</label>
                <Input
                  type="text"
                  maxLength={11}
                  value={formData.mtn_sender_address}
                  onChange={(e) => setFormData({ ...formData, mtn_sender_address: e.target.value })}
                  placeholder="Ex: MonEntreprise"
                />
                <p className="text-[11px] text-slate-400">
                  Nom affiché comme expéditeur des SMS envoyés en mode Réseau (11 caractères max, alphanumérique). Laissez vide pour utiliser le nom par défaut attribué par MTN.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Indicatif pays</label>
                <Input
                  type="text"
                  maxLength={3}
                  value={formData.mtn_country_code}
                  onChange={(e) => setFormData({ ...formData, mtn_country_code: e.target.value })}
                  placeholder="229"
                />
                <p className="text-[11px] text-slate-400">
                  Utilisé pour normaliser vos numéros de destinataires en mode Réseau (229 = Bénin).
                </p>
              </div>
            </div>

            {organisation?.preferred_sms_channel !== 'network' && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Ces réglages ne prennent effet qu'en mode Réseau. Vous êtes actuellement en mode Téléphone : ils sont sans impact tant que vous n'avez pas changé de mode.
              </p>
            )}
          </CardContent>
        </Card>

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
                value={formData.signature}
                onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                placeholder="Ex: - Envoyé via Acme"
              />
              <p className="text-[11px] text-slate-400">
                Sera automatiquement ajoutée à la fin de vos SMS si l'option `append_signature` est activée dans vos appels API.
              </p>
            </div>
          </CardContent>

          <CardFooter className="justify-end border-t border-slate-100 pt-4">
            <Button type="submit" className="font-semibold gap-2" disabled={isPending}>
              <Save className="h-4 w-4" />
              {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}