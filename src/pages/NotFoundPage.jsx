// Page affichée lorsque l'utilisateur visite une URL qui ne correspond à aucune route
// définie dans l'application (erreur 404).
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche un message d'erreur 404 avec des liens pour revenir à l'accueil ou au catalogue.
 */
export default function NotFoundPage() {
  useDocumentTitle('Page introuvable | AgriMarket');
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary-200 sm:text-9xl">404</p>
        <h1 className="mt-4 text-xl font-bold text-neutral-900 sm:text-2xl">Page introuvable</h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-center">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <Link to="/produits" className="btn-outline">
            <Search className="h-4 w-4" /> Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
