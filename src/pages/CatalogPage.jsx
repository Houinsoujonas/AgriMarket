// Page catalogue complet : recherche, filtres (catégorie, prix, stock), tri et grille produits.
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Search, PackageSearch } from 'lucide-react';
import {
  getCategories, getProducts, searchProducts, filterProducts, sortProducts,
} from '@/services/productService';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import { formatPrice } from '@/utils/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche le catalogue de produits avec barre de recherche, filtres et options de tri.
 */
export default function CatalogPage() {
  useDocumentTitle(
    'Catalogue | AgriMarket',
    'Parcourez tous les équipements agricoles disponibles sur AgriMarket : machines, irrigation, traitement, outils et protection.'
  );

  // Paramètres de l'URL (ex : ?q=motoculteur&categorie=machines-agricoles), synchronisés avec les filtres.
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('categorie') ?? 'all';

  // États locaux des différents filtres et options du catalogue.
  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('relevance');
  // Contrôle l'ouverture du panneau de filtres sur mobile (masqué par défaut).
  const [showFilters, setShowFilters] = useState(false);

  // Catégories disponibles pour le filtre (statiques, passent par le service par cohérence).
  const categories = getCategories();

  // Si le paramètre "q" change dans l'URL (ex : recherche depuis le header), on met à jour le champ.
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  // Idem pour le paramètre "categorie".
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Calcule la liste finale des produits à afficher (recherche + filtres + tri).
  // useMemo évite de refaire ce calcul à chaque rendu si les dépendances n'ont pas changé.
  const filteredProducts = useMemo(() => {
    // Étape 1 : recherche textuelle (ou tous les produits si aucune recherche).
    let list = query.trim() ? searchProducts(query) : getProducts();
    // Étape 2 : application des filtres (catégorie, prix, stock).
    list = filterProducts(list, {
      category: selectedCategory,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly,
    });
    // Étape 3 : tri final selon l'option choisie.
    list = sortProducts(list, sort);
    return list;
  }, [query, selectedCategory, minPrice, maxPrice, inStockOnly, sort]);

  /**
   * Change la catégorie sélectionnée et met à jour l'URL en conséquence.
   * @param {string} slug - Le slug de la catégorie choisie ("all" pour toutes les catégories).
   */
  function handleCategoryChange(slug) {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('categorie');
    } else {
      params.set('categorie', slug);
    }
    setSearchParams(params);
  }

  /**
   * Réinitialise tous les filtres et la recherche à leur valeur par défaut.
   */
  function clearFilters() {
    setQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSort('relevance');
    setSearchParams({});
  }

  // Vrai si au moins un filtre ou une recherche est actuellement actif.
  const hasActiveFilters = query || selectedCategory !== 'all' || minPrice || maxPrice || inStockOnly;

  // Panneau de filtres, réutilisé à la fois dans la barre latérale (desktop) et le tiroir (mobile).
  const filterPanel = (
    <div className="space-y-6">
      {/* Filtre par catégorie */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Catégorie</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-50 font-medium text-primary-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary-50 font-medium text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre par fourchette de prix (min / max) */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Prix</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="input py-2 text-sm"
            aria-label="Prix minimum"
          />
          <span className="text-neutral-400">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="input py-2 text-sm"
            aria-label="Prix maximum"
          />
        </div>
        {/* Résumé lisible de la fourchette de prix choisie */}
        {(minPrice || maxPrice) && (
          <p className="mt-2 text-xs text-neutral-500">
            {minPrice && `À partir de ${formatPrice(Number(minPrice))}`}
            {minPrice && maxPrice && ' · '}
            {maxPrice && `Jusqu'à ${formatPrice(Number(maxPrice))}`}
          </p>
        )}
      </div>

      {/* Filtre "en stock uniquement" */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Disponibilité</h3>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">En stock uniquement</span>
        </label>
      </div>

      {/* Bouton "Effacer les filtres", visible seulement si un filtre est actif */}
      {hasActiveFilters && (
        <button onClick={clearFilters} className="btn-ghost w-full text-sm">
          <X className="h-4 w-4" /> Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* En-tête de page avec fil d'Ariane et compteur de résultats */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'Produits' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">Catalogue</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Barre de recherche visible uniquement sur mobile (le header a déjà la sienne sur desktop) */}
        <div className="mb-6 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/15"
              aria-label="Rechercher"
            />
          </div>
        </div>

        {/* Mise en page à deux colonnes : filtres à gauche, produits à droite */}
        <div className="flex gap-8">
          {/* Barre latérale de filtres, visible uniquement sur grand écran */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
                  <h2 className="text-sm font-semibold text-neutral-900">Filtres</h2>
                </div>
                {filterPanel}
              </div>
            </div>
          </aside>

          {/* Zone principale : barre d'outils (filtrer/trier) + grille de produits */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between gap-4">
              {/* Bouton qui ouvre le tiroir de filtres, visible uniquement sur mobile */}
              <button
                onClick={() => setShowFilters(true)}
                className="btn-outline px-4 py-2 text-sm lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filtrer
              </button>

              <div className="hidden lg:block" />

              {/* Sélecteur de tri des résultats */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-neutral-500">Trier :</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/15"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>

            {/* Grille de résultats, ou état vide si aucun produit ne correspond */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<PackageSearch className="h-8 w-8" />}
                title="Aucun produit trouvé"
                description="Essayez de modifier vos critères de recherche ou de filtrage pour trouver ce que vous cherchez."
                actionLabel="Voir tous les produits"
                actionLink="/produits"
              />
            )}
          </div>
        </div>
      </div>

      {/* Tiroir de filtres mobile, affiché en superposition par-dessus la page */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Fond semi-transparent cliquable pour fermer le tiroir */}
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl animate-slide-down overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <h2 className="text-base font-semibold text-neutral-900">Filtres</h2>
              <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-neutral-600" aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {filterPanel}
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary mt-6 w-full"
              >
                Voir {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
