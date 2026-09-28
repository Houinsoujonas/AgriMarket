// Fonctions utilitaires pour rechercher, filtrer et trier les produits du catalogue.
//
// Chaque fonction accepte un paramètre `list` optionnel (par défaut : le catalogue statique
// `data/products.js`). Cela permet à `services/productService.js` de réutiliser exactement
// cette même logique, mais appliquée au catalogue "vivant" (statique + produits ajoutés/modifiés
// depuis l'espace admin), sans dupliquer aucun code de recherche/filtre/tri.
import { products as allProducts } from '@/data/products';

/**
 * Recherche un produit par son identifiant.
 * @param {string} id - L'identifiant du produit recherché.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product | undefined} Le produit trouvé, ou undefined si absent.
 */
export function getProductById(id, list = allProducts) {
  return list.find((p) => p.id === id);
}

/**
 * Recherche un produit par son slug (utilisé dans les URLs).
 * @param {string} slug - Le slug du produit recherché.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product | undefined} Le produit trouvé, ou undefined si absent.
 */
export function getProductBySlug(slug, list = allProducts) {
  return list.find((p) => p.slug === slug);
}

/**
 * Récupère tous les produits appartenant à une catégorie donnée.
 * @param {string} categorySlug - Le slug de la catégorie.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle filtrer.
 * @returns {import('@/types').Product[]} La liste des produits de cette catégorie.
 */
export function getProductsByCategory(categorySlug, list = allProducts) {
  return list.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Récupère des produits similaires (même catégorie, produit courant exclu).
 * @param {import('@/types').Product} product - Le produit de référence.
 * @param {number} [limit] - Nombre maximum de produits à retourner.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product[]} La liste des produits similaires.
 */
export function getSimilarProducts(product, limit = 4, list = allProducts) {
  return list
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

/**
 * Récupère les produits les plus populaires (en stock, triés par note décroissante).
 * @param {number} [limit] - Nombre maximum de produits à retourner.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product[]} La liste des produits populaires.
 */
export function getPopularProducts(limit = 8, list = allProducts) {
  return [...list] // copie du tableau pour ne pas modifier l'original avec sort()
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Récupère les produits actuellement en promotion (ancien prix supérieur au prix actuel).
 * @param {number} [limit] - Nombre maximum de produits à retourner.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product[]} La liste des produits en promotion.
 */
export function getPromoProducts(limit = 4, list = allProducts) {
  return list
    .filter((p) => p.oldPrice && p.oldPrice > p.price && p.stock > 0)
    .slice(0, limit);
}

/**
 * Récupère les produits les plus récemment ajoutés au catalogue.
 * @param {number} [limit] - Nombre maximum de produits à retourner.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product[]} La liste des nouveaux produits.
 */
export function getNewProducts(limit = 4, list = allProducts) {
  return [...list]
    // Trie du plus récent au plus ancien en comparant les dates de création.
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Recherche des produits par mot-clé (nom, description, catégorie).
 * @param {string} query - Le texte recherché par l'utilisateur.
 * @param {import('@/types').Product[]} [list] - Liste dans laquelle chercher.
 * @returns {import('@/types').Product[]} La liste des produits correspondants.
 */
export function searchProducts(query, list = allProducts) {
  // Normalise la recherche : minuscules et sans espaces superflus.
  const q = query.toLowerCase().trim();
  if (!q) return list; // pas de recherche -> on retourne tout le catalogue
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
  );
}

/**
 * Filtre une liste de produits selon plusieurs critères (catégorie, prix, stock).
 * @param {import('@/types').Product[]} list - La liste de produits à filtrer.
 * @param {{ category?: string, minPrice?: number, maxPrice?: number, inStockOnly?: boolean }} filters - Les critères de filtrage.
 * @returns {import('@/types').Product[]} La liste filtrée.
 */
export function filterProducts(list, filters) {
  return list.filter((p) => {
    // Filtre par catégorie (sauf si "all" ou non défini).
    if (filters.category && filters.category !== 'all' && p.categorySlug !== filters.category) return false;
    // Filtre par prix minimum.
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    // Filtre par prix maximum.
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    // Filtre "en stock uniquement".
    if (filters.inStockOnly && p.stock <= 0) return false;
    return true;
  });
}

/**
 * Trie une liste de produits selon l'option choisie.
 * @param {import('@/types').Product[]} list - La liste de produits à trier.
 * @param {'relevance'|'price-asc'|'price-desc'|'newest'} sort - Le critère de tri.
 * @returns {import('@/types').Product[]} La liste triée (nouvelle copie, la liste d'origine n'est pas modifiée).
 */
export function sortProducts(list, sort) {
  const sorted = [...list]; // copie pour éviter de muter la liste d'origine
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      // Par défaut (pertinence) : on trie par note décroissante.
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}
