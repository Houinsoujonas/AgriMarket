// Composant "fil d'Ariane" : affiche le chemin de navigation en haut d'une page
// (ex : Accueil > Produits > Nom du produit) pour aider l'utilisateur à se repérer.
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Affiche un fil d'Ariane à partir d'une liste d'étapes.
 * @param {{ items: { label: string, path?: string }[] }} props - La liste des étapes à afficher
 * (chaque étape a un libellé, et un chemin optionnel si elle est cliquable).
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm">
      {/* Icône "Accueil" toujours cliquable, en tout début de fil d'Ariane */}
      <Link to="/" className="text-neutral-500 hover:text-primary-600 transition-colors" aria-label="Accueil">
        <Home className="h-4 w-4" />
      </Link>
      {/* On parcourt chaque étape reçue pour l'afficher, séparée par un chevron */}
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <ChevronRight className="h-4 w-4 text-neutral-300" />
          {item.path ? (
            // Étape avec un chemin : c'est un lien cliquable
            <Link to={item.path} className="text-neutral-500 hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            // Étape sans chemin : c'est la page actuelle, affichée en texte simple (non cliquable)
            <span className="font-medium text-neutral-800">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
