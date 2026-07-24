import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  KeyRound,
  Webhook as WebhookIcon,
  Building2,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const NAV_ITEMS = [
  { path: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { path: '/admin/devices', label: 'Téléphones (Devices)', icon: Smartphone, badge: '4' },
  { path: '/admin/sms-logs', label: 'Historique SMS', icon: MessageSquare },
  { path: '/admin/api-keys', label: 'Clés API', icon: KeyRound },
  { path: '/admin/webhooks', label: 'Webhooks', icon: WebhookIcon },
  { path: '/admin/organisation', label: 'Organisation', icon: Building2 },
  { path: '/admin/abonnement', label: 'Abonnement', icon: CreditCard, badge: 'Business' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = NAV_ITEMS.find((item) => item.path === location.pathname) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row antialiased font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2.5 font-bold text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none text-white">SMS Gateway</span>
                <span className="text-[10px] font-medium text-indigo-400">Espace Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Device Quick Status Box */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Passerelles actives</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                4/5 En ligne
              </span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-indigo-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/docs"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-300 hover:bg-indigo-900/50 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Docs API v1.0
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <div className="flex items-center justify-between pt-1 text-slate-400 text-xs">
            <Link to="/" className="hover:text-white flex items-center gap-1">
              ← Retour au site
            </Link>
            <span>v1.4.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{activeItem.label}</h1>
              <span className="hidden sm:inline-block text-xs text-slate-400">/ Acme Tech</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Search Input */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher SMS, device, clé..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
            </button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    AT
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">Acme Tech</span>
                    <span className="text-[10px] text-slate-500">Plan Business</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right" className="w-56">
                <div className="px-3 py-2 text-xs">
                  <p className="font-semibold text-slate-900">Acme Technologies SAS</p>
                  <p className="text-slate-500 truncate">admin@acme-tech.fr</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/organisation')}>
                  <Building2 className="mr-2 h-4 w-4 text-slate-500" />
                  Paramètres Organisation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/abonnement')}>
                  <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
                  Gérer l'abonnement
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')} destructive>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
