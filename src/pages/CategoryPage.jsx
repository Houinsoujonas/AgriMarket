// Page listant les produits d'une catégorie précise (ex : /categorie/irrigation).
import { useParams, Link } from 'react-router-dom';
import { getCategories, getProductsByCategory } from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import { ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche la bannière d'une catégorie ainsi que la grille de ses produits.
 */
export default function CategoryPage() {
  // Récupère le slug de la catégorie depuis l'URL (ex : "irrigation").
  const { slug } = useParams();
  // Recherche la catégorie correspondante dans les données statiques.
  const category = getCategories().find((c) => c.slug === slug);
  // Récupère tous les produits appartenant à cette catégorie.
  const products = slug ? getProductsByCategory(slug) : [];

  useDocumentTitle(
    category ? `${category.name} | AgriMarket` : 'Catégorie introuvable | AgriMarket',
    category?.description
  );

  // Si aucune catégorie ne correspond au slug de l'URL, on affiche un message d'erreur.
  if (!category) {
    return (
      <div className="container-app py-20">
        <EmptyState
          title="Catégorie introuvable"
          description="Cette catégorie n'existe pas ou plus."
          actionLabel="Voir le catalogue"
          actionLink="/produits"
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Bannière d'en-tête avec l'image de fond de la catégorie */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600">
        <div className="absolute inset-0 opacity-20">
          <img src={category.image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/70 to-primary-700/20" />
        <div className="container-app relative z-10 py-12 lg:py-16">
          <div className="text-white">
            <Breadcrumb
              items={[
                { label: 'Produits', path: '/produits' },
                { label: category.name },
              ]}
            />
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">{category.name}</h1>
            <p className="mt-3 max-w-xl text-sm text-primary-100 lg:text-base">{category.description}</p>
            <p className="mt-4 text-sm text-primary-200">
              {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        {/* Grille des produits, ou message si la catégorie est vide */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun produit dans cette catégorie"
            description="Revenez bientôt, de nouveaux produits seront ajoutés."
            actionLabel="Voir tous les produits"
            actionLink="/produits"
          />
        )}

        <div className="mt-8">
          <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:gap-2.5 transition-all">
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
