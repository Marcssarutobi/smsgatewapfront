import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Github, Twitter, Linkedin, ShieldCheck, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white">SMS Gateway</span>
                <span className="text-[10px] font-medium text-indigo-400 tracking-wider uppercase">Android SaaS</span>
              </div>
            </Link>
            <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
              Transformez vos smartphones Android ordinaires en passerelles d’envoi SMS professionnelles à haut débit via une API REST ultra-simple et des webhooks temps réel.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Produit */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Produit</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#features" className="text-slate-400 hover:text-white transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-slate-400 hover:text-white transition-colors">
                  Grille Tarifaire
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-slate-400 hover:text-white transition-colors">
                  Documentation API
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Espace Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ressources & Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support & Docs</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/docs#quickstart" className="text-slate-400 hover:text-white transition-colors">
                  Guide de démarrage
                </Link>
              </li>
              <li>
                <Link to="/docs#sdks" className="text-slate-400 hover:text-white transition-colors">
                  Exemples cURL & JS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Formulaire de Contact
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ & Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Légal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Légal & Sécurité</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Conditions d'Utilisation (CGU)</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Conformité RGPD</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SMS Gateway SaaS. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Statut du service : <strong className="text-emerald-400 font-semibold">99.98% Opérationnel</strong></span>
            <Link to="/privacy" className="hover:underline">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
