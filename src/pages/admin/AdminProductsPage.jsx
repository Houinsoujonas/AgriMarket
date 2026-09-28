// Liste et gestion des produits côté admin : recherche, filtre par catégorie, tri,
// et actions voir / modifier / supprimer (avec confirmation avant toute suppression).
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, PackageSearch } from 'lucide-react';
import {
  getProducts, getCategories, deleteProduct,
  searchProducts, filterProducts, sortProducts,
} from '@/services/productService';
import { formatPrice } from '@/utils/format';
import { useToast } from '@/context/ToastContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import EmptyState from '@/components/EmptyState';

/**
 * Affiche le tableau de gestion des produits (recherche, filtre, tri, actions CRUD).
 */
export default function AdminProductsPage() {
  useDocumentTitle('Produits | Administration AgriMarket');
  const { showToast } = useToast();
  const categories = getCategories();

  // La liste est recopiée en état local pour pouvoir se rafraîchir après ajout/suppression
  // (productService lit/écrit le localStorage, mais ne notifie pas automatiquement React).
  const [products, setProducts] = useState(() => getProducts());
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  // Produit en attente de confirmation de suppression (null = aucune boîte de dialogue ouverte).
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredProducts = useMemo(() => {
    let list = query.trim() ? searchProducts(query, products) : products;
    list = filterProducts(list, { category: categoryFilter });
    return sortProducts(list, sort);
  }, [products, query, categoryFilter, sort]);

  /** Recharge la liste des produits depuis le service (après une mutation). */
  function refresh() {
    setProducts(getProducts());
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id);
    showToast(`${pendingDelete.name} a été supprimé du catalogue`, 'success');
    setPendingDelete(null);
    refresh();
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Produits</h1>
          <p className="mt-1 text-sm text-neutral-500">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/admin/produits/nouveau" className="btn-primary">
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Link>
      </div>

      {/* Barre d'outils : recherche, filtre catégorie, tri */}
      <div className="card mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="input py-2 pl-9 text-sm"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input w-full py-2 text-sm sm:w-52">
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-full py-2 text-sm sm:w-44">
          <option value="newest">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="relevance">Pertinence</option>
        </select>
      </div>

      {/* Tableau des produits */}
      {filteredProducts.length > 0 ? (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]?.url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      <span className="font-medium text-neutral-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.category}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.stock > 0 ? (
                      <span className="badge bg-success-50 text-success-600">En stock</span>
                    ) : (
                      <span className="badge bg-error-50 text-error-600">Rupture</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/produits/${p.id}`} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700" aria-label={`Voir ${p.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/admin/produits/${p.id}/modifier`} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-primary-700" aria-label={`Modifier ${p.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setPendingDelete(p)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-error-50 hover:text-error-600" aria-label={`Supprimer ${p.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<PackageSearch className="h-8 w-8" />}
            title="Aucun produit ne correspond"
            description="Essayez de modifier votre recherche ou vos filtres."
          />
        </div>
      )}

      {/* Boîte de dialogue de confirmation avant suppression */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4" onClick={() => setPendingDelete(null)}>
          <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-neutral-900">Supprimer ce produit ?</h2>
            <p className="mt-2 text-sm text-neutral-500">
              « {pendingDelete.name} » sera retiré définitivement du catalogue. Cette action est irréversible.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setPendingDelete(null)} className="btn-ghost">Annuler</button>
              <button onClick={confirmDelete} className="btn bg-error-600 text-white hover:bg-error-700">
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
