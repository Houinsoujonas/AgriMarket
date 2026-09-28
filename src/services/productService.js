// Couche de service centralisant l'accès aux produits.
//
// Pourquoi ce fichier ? Pour que les composants (catalogue, fiche produit, admin...) n'aient
// JAMAIS à lire/écrire le localStorage directement. Aujourd'hui la "base de données" est un
// simple overlay localStorage posé par-dessus le catalogue statique (data/products.js), mais
// demain elle pourra devenir un vrai appel réseau (API REST + base de données) : il suffira de
// changer l'intérieur de ce fichier, sans toucher aux pages qui l'utilisent.
import { products as seedProducts } from '@/data/products';
import { categories as seedCategories } from '@/data/categories';
import {
  getProductById as findById,
  getProductBySlug as findBySlug,
  getProductsByCategory as findByCategory,
  getSimilarProducts as findSimilar,
  getPopularProducts as findPopular,
  getPromoProducts as findPromo,
  getNewProducts as findNew,
  searchProducts as searchInList,
  filterProducts as filterList,
  sortProducts as sortList,
} from '@/utils/products';

// Clé localStorage de l'overlay produits (ajouts/modifications/suppressions faits depuis l'admin).
const OVERLAY_KEY = 'agrimarket_products_overlay';

/**
 * Forme de l'overlay stocké en localStorage.
 * @typedef {Object} ProductsOverlay
 * @property {import('@/types').Product[]} added - Produits créés depuis l'admin (pas dans le seed).
 * @property {Record<string, Partial<import('@/types').Product>>} edited - Correctifs par id, appliqués par-dessus le seed ou un produit ajouté.
 * @property {string[]} deletedIds - Identifiants de produits du seed masqués (supprimés) depuis l'admin.
 */

/** @returns {ProductsOverlay} L'overlay actuellement stocké, ou une structure vide par défaut. */
function readOverlay() {
  try {
    const raw = localStorage.getItem(OVERLAY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        added: Array.isArray(parsed.added) ? parsed.added : [],
        edited: parsed.edited && typeof parsed.edited === 'object' ? parsed.edited : {},
        deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      };
    }
  } catch {
    // localStorage corrompu ou inaccessible : on repart d'un overlay vide plutôt que de planter.
  }
  return { added: [], edited: {}, deletedIds: [] };
}

/** Persiste l'overlay fourni dans le localStorage. @param {ProductsOverlay} overlay */
function writeOverlay(overlay) {
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
}

/**
 * Construit la liste "vivante" des produits : catalogue statique + produits ajoutés,
 * avec les modifications admin appliquées et les suppressions masquées.
 * @returns {import('@/types').Product[]}
 */
function getLiveProducts() {
  const overlay = readOverlay();
  const merged = [...seedProducts, ...overlay.added]
    .filter((p) => !overlay.deletedIds.includes(p.id))
    .map((p) => (overlay.edited[p.id] ? { ...p, ...overlay.edited[p.id] } : p));
  return merged;
}

/** Génère un identifiant unique pour un nouveau produit créé depuis l'admin. */
function generateProductId() {
  return `p_${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

// ---------------------------------------------------------------------------
// Lecture
// ---------------------------------------------------------------------------

/** @returns {import('@/types').Product[]} Tous les produits actuellement disponibles. */
export function getProducts() {
  return getLiveProducts();
}

/** @returns {import('@/types').Category[]} Les catégories (fixes, non éditables depuis l'admin). */
export function getCategories() {
  return seedCategories;
}

/** @param {string} id @returns {import('@/types').Product | undefined} */
export function getProductById(id) {
  return findById(id, getLiveProducts());
}

/** @param {string} slug @returns {import('@/types').Product | undefined} */
export function getProductBySlug(slug) {
  return findBySlug(slug, getLiveProducts());
}

/** @param {string} categorySlug @returns {import('@/types').Product[]} */
export function getProductsByCategory(categorySlug) {
  return findByCategory(categorySlug, getLiveProducts());
}

/**
 * @param {import('@/types').Product} product
 * @param {number} [limit]
 * @returns {import('@/types').Product[]}
 */
export function getSimilarProducts(product, limit = 4) {
  return findSimilar(product, limit, getLiveProducts());
}

/** @param {number} [limit] @returns {import('@/types').Product[]} */
export function getPopularProducts(limit = 8) {
  return findPopular(limit, getLiveProducts());
}

/** @param {number} [limit] @returns {import('@/types').Product[]} */
export function getPromoProducts(limit = 4) {
  return findPromo(limit, getLiveProducts());
}

/** @param {number} [limit] @returns {import('@/types').Product[]} */
export function getNewProducts(limit = 4) {
  return findNew(limit, getLiveProducts());
}

/** @param {string} query @returns {import('@/types').Product[]} */
export function searchProducts(query) {
  return searchInList(query, getLiveProducts());
}

/**
 * @param {import('@/types').Product[]} list
 * @param {{ category?: string, minPrice?: number, maxPrice?: number, inStockOnly?: boolean }} filters
 * @returns {import('@/types').Product[]}
 */
export function filterProducts(list, filters) {
  return filterList(list, filters);
}

/**
 * @param {import('@/types').Product[]} list
 * @param {'relevance'|'price-asc'|'price-desc'|'newest'} sort
 * @returns {import('@/types').Product[]}
 */
export function sortProducts(list, sort) {
  return sortList(list, sort);
}

// ---------------------------------------------------------------------------
// Écriture (réservé à l'espace admin)
// ---------------------------------------------------------------------------

/**
 * Ajoute un nouveau produit au catalogue.
 * @param {Partial<import('@/types').Product>} data - Données du produit (sans id).
 * @returns {import('@/types').Product} Le produit créé (avec son id généré).
 */
export function addProduct(data) {
  const id = generateProductId();
  /** @type {import('@/types').Product} */
  const product = {
    images: [],
    specifications: {},
    stock: 0,
    rating: 0,
    reviews: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    ...data,
    id,
    sku: data.sku || `SKU-${id.toUpperCase()}`,
  };
  const overlay = readOverlay();
  overlay.added.push(product);
  writeOverlay(overlay);
  return product;
}

/**
 * Applique une modification partielle à un produit existant (du seed ou ajouté).
 * @param {string} id - Identifiant du produit à modifier.
 * @param {Partial<import('@/types').Product>} patch - Champs à mettre à jour.
 * @returns {import('@/types').Product | undefined} Le produit mis à jour, ou undefined s'il n'existe pas.
 */
export function updateProduct(id, patch) {
  const overlay = readOverlay();
  const addedIndex = overlay.added.findIndex((p) => p.id === id);
  if (addedIndex !== -1) {
    // Produit créé depuis l'admin : on patche directement l'entrée.
    overlay.added[addedIndex] = { ...overlay.added[addedIndex], ...patch };
  } else {
    // Produit du catalogue statique : on stocke un correctif appliqué à la lecture.
    overlay.edited[id] = { ...(overlay.edited[id] || {}), ...patch };
  }
  writeOverlay(overlay);
  return getProductById(id);
}

/**
 * Supprime un produit du catalogue (masque un produit du seed, ou retire un produit ajouté).
 * @param {string} id - Identifiant du produit à supprimer.
 */
export function deleteProduct(id) {
  const overlay = readOverlay();
  overlay.added = overlay.added.filter((p) => p.id !== id);
  delete overlay.edited[id];
  const isSeedProduct = seedProducts.some((p) => p.id === id);
  if (isSeedProduct && !overlay.deletedIds.includes(id)) {
    overlay.deletedIds.push(id);
  }
  writeOverlay(overlay);
}
