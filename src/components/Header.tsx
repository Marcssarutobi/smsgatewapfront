import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X, ArrowRight, LayoutDashboard, Download } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isNavActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight text-slate-900">SMS Gateway</span>
            <span className="text-[10px] font-medium text-indigo-600 tracking-wider uppercase">Android SaaS</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/#features"
            onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Fonctionnalités
          </Link>
          <Link
            to="/#pricing"
            onClick={() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Tarifs
          </Link>
          <Link
            to="/docs"
            className={`transition-colors ${
              isNavActive('/docs') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Documentation API
          </Link>
          <Link
            to="/contact"
            className={`transition-colors ${
              isNavActive('/contact') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            Contact
          </Link>
          <a
            href="/downloads/sms-gateway.apk"
            download
            className={`flex items-center gap-1.5 transition-colors ${
              isNavActive('/download-app') ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            App mobile
          </a>
        </nav>

        {/* Right CTA / Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="font-medium text-slate-700 hover:text-slate-900">
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="font-semibold shadow-sm">
              Créer un compte
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {/* <Link to="/admin" className="ml-1">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-600">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Demo Admin
            </Button>
          </Link> */}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden animate-in fade-in-0 duration-200">
          <div className="flex flex-col space-y-3 pt-2 text-base font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Accueil
            </Link>
            <Link
              to="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Fonctionnalités
            </Link>
            <Link
              to="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Tarifs
            </Link>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Documentation API
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Politique de Confidentialité
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Contact
            </Link>
            <Link
              to="/download-app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              App mobile
            </Link>

            <div className="pt-4 flex flex-col gap-2 border-t border-slate-100">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Connexion
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">
                  Créer un compte
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Accéder à la démo Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
