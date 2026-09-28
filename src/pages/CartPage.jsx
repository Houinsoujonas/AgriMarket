// Page du panier : liste des articles ajoutés, gestion des quantités et résumé de commande.
import { Link } from 'react-router-dom';
import {
  Trash2, ShoppingBag, ArrowRight, ShoppingCart,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatPriceShort, resizeImage } from '@/utils/format';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import QuantitySelector from '@/components/QuantitySelector';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche le contenu du panier (ou un état vide) et le résumé des montants à payer.
 */
export default function CartPage() {
  useDocumentTitle('Panier | AgriMarket');
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, deliveryFee, total } = useCart();

  // Cas particulier : panier vide -> on affiche un message avec un lien vers le catalogue.
  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="border-b border-neutral-200 bg-white">
          <div className="container-app py-6">
            <Breadcrumb items={[{ label: 'Panier' }]} />
          </div>
        </div>
        <div className="container-app py-16 lg:py-24">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Votre panier est vide"
            description="Découvrez notre sélection d'équipements agricoles et ajoutez des produits à votre panier."
            actionLabel="Voir les produits"
            actionLink="/produits"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'Panier' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">Votre panier</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
          </p>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale : liste des articles du panier */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <ul className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4 p-4 sm:p-5">
                    {/* Miniature de l'image du produit, cliquable vers la fiche produit */}
                    <Link
                      to={`/produits/${item.product.id}`}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 sm:h-24 sm:w-24"
                    >
                      <img
                        src={resizeImage(item.product.images[0]?.url, 200)}
                        alt={item.product.images[0]?.alt ?? item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Détails de l'article : nom, quantité, prix, suppression */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
                            {item.product.category}
                          </span>
                          <Link
                            to={`/produits/${item.product.id}`}
                            className="block text-sm font-semibold text-neutral-900 hover:text-primary-700 transition-colors sm:text-base"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        {/* Bouton pour retirer complètement l'article du panier */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-600"
                          aria-label={`Supprimer ${item.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-end justify-between">
                        {/* Sélecteur de quantité, borné par le stock disponible du produit */}
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
                          onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
                          onChange={(val) => updateQuantity(item.product.id, val)}
                          max={item.product.stock > 0 ? item.product.stock : 99}
                          size="sm"
                        />
                        <div className="text-right">
                          <div className="text-sm font-semibold text-neutral-900 sm:text-base">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          {/* Prix unitaire affiché seulement si la quantité est supérieure à 1 */}
                          {item.quantity > 1 && (
                            <div className="text-xs text-neutral-400">
                              {formatPriceShort(item.product.price)} / unité
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Link to="/produits" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:gap-2.5 transition-all">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continuer mes achats
              </Link>
              {/* Bouton pour vider entièrement le panier en un clic */}
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-error-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Vider le panier
              </button>
            </div>
          </div>

          {/* Colonne latérale : résumé des montants (sous-total, livraison, total) */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              <h2 className="text-base font-semibold text-neutral-900">Résumé de la commande</h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Sous-total</span>
                  <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Livraison</span>
                  <span className="font-medium text-neutral-900">{formatPrice(deliveryFee)}</span>
                </div>
              </div>

              <div className="my-4 border-t border-neutral-200" />

              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-primary-700">{formatPrice(total)}</span>
              </div>

              <Link to="/commande" className="btn-primary mt-6 w-full">
                <ShoppingCart className="h-4 w-4" />
                Passer la commande
              </Link>

              <p className="mt-4 text-center text-xs text-neutral-400">
                Paiement via WhatsApp · Livraison ou retrait en boutique
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
