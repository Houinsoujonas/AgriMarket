// Composant générique affiché quand une liste est vide (panier vide, aucun résultat de
// recherche, produit introuvable, etc.). Réutilisable avec une icône et un texte personnalisés.
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

/**
 * Affiche un message d'état vide, avec une icône, un titre, une description
 * et un bouton d'action optionnels.
 * @param {{
 *   icon?: import('react').ReactNode,
 *   title: string,
 *   description?: string,
 *   actionLabel?: string,
 *   actionLink?: string,
 * }} props
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      {/* Icône fournie, ou icône de recherche par défaut si aucune n'est passée */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
        {icon ?? <Search className="h-8 w-8" />}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-neutral-900">{title}</h3>
      {/* La description ne s'affiche que si elle est fournie */}
      {description && (
        <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p>
      )}
      {/* Le bouton d'action ne s'affiche que si un libellé ET un lien sont fournis */}
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
