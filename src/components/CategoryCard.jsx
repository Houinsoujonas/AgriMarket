// Carte cliquable présentant une catégorie de produits (icône + nom + description).
import { Link } from 'react-router-dom';
import { ArrowRight, Tractor, Droplets, SprayCan, Wrench, ShieldCheck } from 'lucide-react';

// Correspondance entre le nom d'icône stocké dans les données (chaîne de caractères)
// et le composant d'icône Lucide réellement affiché à l'écran.
const iconMap = {
  Tractor,
  Droplets,
  SprayCan,
  Wrench,
  ShieldCheck,
};

/**
 * Affiche une carte cliquable pour une catégorie, redirigeant vers sa page dédiée.
 * @param {{ category: import('@/types').Category }} props - La catégorie à afficher.
 */
export default function CategoryCard({ category }) {
  // Sélectionne l'icône correspondante, avec "Tractor" comme icône de secours par défaut.
  const Icon = iconMap[category.icon] ?? Tractor;

  return (
    <Link
      to={`/categorie/${category.slug}`}
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/60 hover:-translate-y-0.5"
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-neutral-900">{category.name}</h3>
        <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 max-w-[200px]">{category.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
          Voir les produits <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
