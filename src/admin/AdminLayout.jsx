// Mise en page de l'espace administrateur : barre latérale + en-tête, visuellement distincts
// du site public mais cohérents avec l'identité AgriMarket (mêmes tokens de couleur/police).
import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, ExternalLink, Menu, X } from 'lucide-react';
import { LogoMark } from '@/components/Logo';

// Liens de la barre latérale (icône, libellé, chemin). `end` évite que "/admin" reste actif
// sur toutes les sous-pages (comportement standard de NavLink pour un lien racine).
const navItems = [
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Produits', path: '/admin/produits', icon: Package },
  { label: 'Commandes', path: '/admin/commandes', icon: ClipboardList },
];

/**
 * Structure commune de l'espace admin (sidebar + en-tête), avec la page active
 * injectée via <Outlet /> (voir les routes imbriquées sous /admin dans App.jsx).
 */
export default function AdminLayout() {
  // Contrôle l'ouverture de la sidebar sur mobile (masquée par défaut, comme le menu public).
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-4 py-5">
        <LogoMark className="h-8 w-8" />
        <div>
          <p className="text-sm font-bold text-neutral-900">AgriMarket</p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-primary-600">Administration</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100"
        >
          <ExternalLink className="h-4 w-4" /> Retour au site
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar desktop, toujours visible à partir de lg */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile, en tiroir superposé */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl animate-slide-down">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100"
              aria-label="Fermer le menu"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {/* En-tête admin : bouton menu mobile + bandeau "démo" */}
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden text-sm font-medium text-neutral-500 lg:block">
            Espace de gestion AgriMarket
          </span>
          <span className="badge bg-accent-50 text-accent-700">Démo — non sécurisé</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
