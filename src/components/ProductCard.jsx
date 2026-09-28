// Carte produit utilisée dans les grilles (catalogue, catégorie, accueil...).
// Affiche l'image, le badge éventuel, le prix, la note et un bouton d'ajout rapide au panier.
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, resizeImage } from '@/utils/format';

/**
 * Affiche une carte cliquable présentant un produit, avec ajout rapide au panier.
 * @param {{ product: import('@/types').Product }} props - Le produit à afficher.
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  // Indique si l'animation "ajouté ✓" doit être affichée sur le bouton (temporaire).
  const [added, setAdded] = useState(false);

  // Le produit est en stock si sa quantité disponible est strictement positive.
  const inStock = product.stock > 0;
  // Calcule le pourcentage de réduction si un ancien prix existe (sinon 0).
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  /**
   * Gère le clic sur le bouton "Ajouter au panier" directement depuis la carte,
   * sans naviguer vers la fiche produit (d'où le stopPropagation).
   * @param {import('react').MouseEvent} e - L'événement de clic.
   */
  function handleAdd(e) {
    e.preventDefault(); // empêche le clic de déclencher la navigation du <Link> parent
    e.stopPropagation(); // empêche l'événement de remonter plus haut dans le DOM
    if (!inStock) return; // sécurité : impossible d'ajouter un produit en rupture de stock
    addToCart(product);
    setAdded(true);
    showToast(`${product.name} ajouté au panier`, 'success');
    // Remet le bouton à son état normal après 1.5 seconde.
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link
      to={`/produits/${product.id}`}
      className="group card flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/60 hover:-translate-y-0.5"
    >
      {/* Image principale du produit */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={resizeImage(product.images[0]?.url, 500)}
          alt={product.images[0]?.alt ?? product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges affichés en haut à gauche de l'image (promo, nouveau, populaire) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge === 'promo' && discount > 0 && (
            <span className="badge bg-accent-500 text-white shadow-sm">-{discount}%</span>
          )}
          {product.badge === 'nouveau' && (
            <span className="badge bg-primary-600 text-white shadow-sm">Nouveau</span>
          )}
          {product.badge === 'populaire' && (
            <span className="badge bg-neutral-900 text-white shadow-sm">Populaire</span>
          )}
        </div>
        {/* Overlay "Rupture de stock" affiché par-dessus l'image si indisponible */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Corps de la carte : catégorie, nom, note, prix, stock et bouton */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
          {product.category}
        </span>
        <h3 className="mt-1.5 text-sm font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        {/* Note moyenne et nombre d'avis */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
            <span className="text-xs font-medium text-neutral-700">{product.rating}</span>
          </div>
          <span className="text-xs text-neutral-400">({product.reviews})</span>
        </div>

        {/* Prix actuel, et ancien prix barré s'il existe */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-neutral-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* Indicateur de stock + bouton d'ajout rapide, collés en bas de la carte */}
        <div className="mt-auto pt-4">
          <div className="mb-2.5 flex items-center gap-1.5">
            {inStock ? (
              <>
                <span className="h-2 w-2 rounded-full bg-success-500" />
                <span className="text-xs font-medium text-success-600">En stock</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-error-500" />
                <span className="text-xs font-medium text-error-600">Indisponible</span>
              </>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`btn w-full text-xs ${added
              ? 'bg-success-500 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700'
            } active:scale-[0.98]`}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {/* Le contenu du bouton change temporairement pour confirmer l'ajout */}
            {added ? (
              <>
                <Check className="h-4 w-4" /> Ajouté
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
