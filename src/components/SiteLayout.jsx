// Mise en page commune du site public : en-tête + pied de page autour de la page active.
// Séparé de App.jsx pour permettre à l'espace /admin d'utiliser sa propre mise en page
// (AdminLayout), sans le Header/Footer de la boutique.
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Affiche l'en-tête et le pied de page communs, avec la page active injectée via <Outlet />.
 */
export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* En-tête commun, affiché sur toutes les pages publiques */}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Pied de page commun, affiché sur toutes les pages publiques */}
      <Footer />
    </div>
  );
}
