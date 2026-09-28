// Page listant l'ensemble des catégories de produits (accessible depuis le lien "Catégories"
// de la navigation principale).
import { getCategories } from '@/services/productService';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche la grille complète des catégories disponibles sur AgriMarket.
 */
export default function CategoriesPage() {
  useDocumentTitle(
    'Catégories | AgriMarket',
    'Découvrez toutes les catégories de matériel agricole disponibles sur AgriMarket.'
  );
  const categories = getCategories();

  return (
    <div className="animate-fade-in">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'Catégories' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">Nos catégories</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Parcourez l'ensemble de nos rayons pour trouver le matériel adapté à votre activité.
          </p>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}
