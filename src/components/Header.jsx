// En-tête affiché sur toutes les pages : logo, barre de recherche, navigation
// principale, icône panier et menu mobile repliable.
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Logo from '@/components/Logo';

/**
 * Affiche l'en-tête global de l'application (logo, recherche, navigation, panier).
 */
export default function Header() {
  // Nombre total d'articles dans le panier, utilisé pour la pastille sur l'icône panier.
  const { totalItems } = useCart();
  // Permet de rediriger l'utilisateur programmatiquement (ex : après une recherche).
  const navigate = useNavigate();
  // Indique si le menu mobile (hamburger) est actuellement ouvert.
  const [mobileOpen, setMobileOpen] = useState(false);
  // Contenu actuel du champ de recherche (partagé entre version desktop et mobile).
  const [searchValue, setSearchValue] = useState('');

  // Liste des liens de navigation principaux affichés dans le menu (aligné sur la maquette).
  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Produits', path: '/produits' },
    { label: 'Catégories', path: '/categories' },
    { label: 'À propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' },
  ];

  /**
   * Gère la soumission du formulaire de recherche : redirige vers le catalogue
   * filtré par le terme recherché, et referme le menu mobile si besoin.
   * @param {import('react').FormEvent} e - L'événement de soumission du formulaire.
   */
  function handleSearch(e) {
    e.preventDefault(); // empêche le rechargement complet de la page par le navigateur
    if (searchValue.trim()) {
      navigate(`/produits?q=${encodeURIComponent(searchValue.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo cliquable, ramène toujours à l'accueil */}
          <Link to="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
            <Logo textClassName="text-lg lg:text-xl" />
          </Link>

          {/* Barre de recherche visible uniquement en version bureau (large écran) */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/15"
                aria-label="Rechercher un produit"
              />
            </div>
          </form>

          {/* Navigation principale visible uniquement sur grand écran (xl et plus) */}
          <nav className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icône panier (avec pastille du nombre d'articles) + bouton menu mobile */}
          <div className="flex items-center gap-2">
            <Link
              to="/panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-700"
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* La pastille ne s'affiche que si le panier contient au moins un article */}
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 transition-colors hover:bg-neutral-100 xl:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {/* Icône "croix" si le menu est ouvert, sinon icône "hamburger" */}
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant : recherche + tous les liens de navigation */}
        {mobileOpen && (
          <div className="border-t border-neutral-100 py-4 xl:hidden animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:bg-white focus:outline-none"
                  aria-label="Rechercher un produit"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
