// Page fiche produit : galerie d'images, informations détaillées, actions d'achat
// et suggestions de produits similaires.
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, ShoppingCart, MessageCircle, Check, Truck,
  ShieldCheck, RotateCcw, ChevronLeft, ChevronRight, ZoomIn, FileText, Download,
} from 'lucide-react';
import { getProductById, getSimilarProducts } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
// Remarque : la fonction s'appelle "buildProductWhatsAppMessage" (le fichier original importait
// par erreur "buildProductWhatsAppUrl", qui n'existe pas dans utils/format.js -> corrigé ici).
import { formatPrice, buildProductWhatsAppMessage, buildWhatsAppUrl } from '@/utils/format';
import Breadcrumb from '@/components/Breadcrumb';
import QuantitySelector from '@/components/QuantitySelector';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import ImageLightbox from '@/components/product/ImageLightbox';
import View360 from '@/components/product/View360';

/**
 * Affiche la fiche détaillée d'un produit (galerie, prix, description, achat).
 */
export default function ProductDetailPage() {
  // Récupère l'identifiant du produit depuis l'URL (ex : /produits/p001).
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  // Quantité choisie par l'utilisateur avant ajout au panier.
  const [quantity, setQuantity] = useState(1);
  // Index de l'image actuellement affichée dans la galerie.
  const [activeImage, setActiveImage] = useState(0);
  // Indique si l'animation "ajouté ✓" doit être affichée sur le bouton (temporaire).
  const [added, setAdded] = useState(false);
  // Indique si la visionneuse plein écran (lightbox) est actuellement ouverte.
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Recherche le produit correspondant à l'identifiant de l'URL.
  const product = id ? getProductById(id) : undefined;

  // Met à jour le titre de l'onglet avec le nom du produit (restauré au changement de page).
  useDocumentTitle(product ? `${product.name} | AgriMarket` : undefined, product?.shortDescription);

  // Si aucun produit ne correspond, on affiche un message d'erreur avec un lien de retour.
  if (!product) {
    return (
      <div className="container-app py-20">
        <EmptyState
          title="Produit introuvable"
          description="Le produit que vous recherchez n'existe pas ou n'est plus disponible."
          actionLabel="Voir le catalogue"
          actionLink="/produits"
        />
      </div>
    );
  }

  // Le produit est en stock si sa quantité disponible est strictement positive.
  const inStock = product.stock > 0;
  // Calcule le pourcentage de réduction si un ancien prix existe (sinon 0).
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  // Produits similaires suggérés en bas de page (même catégorie).
  const similarProducts = getSimilarProducts(product, 4);

  /**
   * Ajoute le produit au panier avec la quantité sélectionnée.
   */
  function handleAddToCart() {
    if (!inStock || !product) return;
    addToCart(product, quantity);
    setAdded(true);
    showToast(`${product.name} ajouté au panier`, 'success');
    setTimeout(() => setAdded(false), 1500);
  }

  /**
   * Ouvre WhatsApp avec un message pré-rempli pour commander ce produit directement.
   */
  function handleWhatsApp() {
    if (!product) return;
    const msg = buildProductWhatsAppMessage({
      productName: product.name,
      quantity,
      price: product.price,
    });
    window.open(buildWhatsAppUrl(msg), '_blank');
  }

  /**
   * Ajoute le produit au panier puis redirige directement vers la page panier ("achat rapide").
   */
  function handleBuyNow() {
    if (!inStock || !product) return;
    addToCart(product, quantity);
    navigate('/panier');
  }

  return (
    <div className="animate-fade-in">
      {/* Fil d'Ariane : Produits > Catégorie > Nom du produit */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-4">
          <Breadcrumb
            items={[
              { label: 'Produits', path: '/produits' },
              { label: product.category, path: `/categorie/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        {/* Lien de retour, visible uniquement sur mobile */}
        <Link to="/produits" className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-600 lg:hidden">
          <ChevronLeft className="h-4 w-4" /> Retour
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Galerie d'images avec navigation précédent/suivant et miniatures */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group h-full w-full cursor-zoom-in"
                aria-label="Agrandir l'image"
              >
                <img
                  src={product.images[activeImage]?.url}
                  alt={product.images[activeImage]?.alt ?? product.name}
                  className="h-full w-full object-cover"
                />
                {/* Indice visuel "zoom", visible au survol (desktop) et toujours discret sur mobile */}
                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
              {product.badge === 'promo' && discount > 0 && (
                <span className="absolute left-4 top-4 badge bg-accent-500 text-white shadow-md">-{discount}%</span>
              )}
              {product.badge === 'nouveau' && (
                <span className="absolute left-4 top-4 badge bg-primary-600 text-white shadow-md">Nouveau</span>
              )}
              {/* Flèches de navigation entre les images, affichées uniquement s'il y en a plusieurs */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md transition-colors hover:bg-white"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md transition-colors hover:bg-white"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures cliquables pour choisir directement une image de la galerie */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === idx
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    aria-label={`Voir image ${idx + 1}`}
                  >
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne d'informations : nom, note, prix, stock, description, actions */}
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase tracking-wide text-primary-600">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* Marque / modèle / référence, affichés uniquement quand ils sont renseignés */}
            {(product.brand || product.model || product.sku) && (
              <p className="mt-1.5 text-xs text-neutral-400">
                {[product.brand, product.model, product.sku && `Réf. ${product.sku}`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            {/* Étoiles de notation (pleines jusqu'à la note arrondie du produit) */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? 'fill-accent-400 text-accent-400'
                        : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-neutral-700">{product.rating}</span>
              <span className="text-sm text-neutral-400">({product.reviews} avis)</span>
            </div>

            {/* Prix actuel, et ancien prix barré s'il existe */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neutral-900">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            {/* Indicateur de disponibilité en stock */}
            <div className="mt-4">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-600">
                  <span className="h-2 w-2 rounded-full bg-success-500" />
                  En stock ({product.stock} unité{product.stock > 1 ? 's' : ''} disponible{product.stock > 1 ? 's' : ''})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-error-600">
                  <span className="h-2 w-2 rounded-full bg-error-500" />
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Description complète du produit */}
            <p className="mt-5 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>

            {/* Sélecteur de quantité, affiché uniquement si le produit est en stock */}
            {inStock && (
              <div className="mt-6 flex items-center gap-4">
                <div>
                  <label className="label">Quantité</label>
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                    onChange={setQuantity}
                    max={product.stock}
                  />
                </div>
              </div>
            )}

            {/* Boutons d'action principaux : ajouter au panier / acheter maintenant */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`btn flex-1 text-sm ${added ? 'bg-success-500 text-white' : 'btn-primary'}`}
              >
                {added ? (
                  <><Check className="h-4 w-4" /> Ajouté au panier</>
                ) : (
                  <><ShoppingCart className="h-4 w-4" /> Ajouter au panier</>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn-outline flex-1 text-sm"
              >
                Acheter maintenant
              </button>
            </div>

            {/* Commande directe via WhatsApp */}
            <button
              onClick={handleWhatsApp}
              disabled={!inStock}
              className="btn mt-3 w-full bg-[#25D366] text-white hover:bg-[#1da851] text-sm active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" /> Commander via WhatsApp
            </button>

            {/* Petits badges de confiance (livraison, garantie, retour) */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6">
              {[
                { icon: Truck, label: 'Livraison rapide' },
                { icon: ShieldCheck, label: 'Qualité garantie' },
                { icon: RotateCcw, label: 'Retour 14 jours' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <item.icon className="h-5 w-5 text-primary-600" />
                  <span className="mt-1.5 text-xs text-neutral-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau des caractéristiques techniques du produit */}
        <div className="mt-12 lg:mt-16">
          <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Caractéristiques</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}>
                    <td className="px-5 py-3 font-medium text-neutral-700 w-1/3">{key}</td>
                    <td className="px-5 py-3 text-neutral-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vue à 360°, affichée uniquement si une vraie séquence d'images a été fournie */}
        {product.view360 && product.view360.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Vue à 360°</h2>
            <div className="mt-6 max-w-xl">
              <View360 images={product.view360} name={product.name} />
            </div>
          </div>
        )}

        {/* Vidéo de présentation, affichée uniquement si une URL a été fournie */}
        {product.videoUrl && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Vidéo de présentation</h2>
            <video
              src={product.videoUrl}
              controls
              className="mt-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200"
            />
          </div>
        )}

        {/* Documents téléchargeables, affichés uniquement s'ils existent réellement */}
        {product.documents && product.documents.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Documentation</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:max-w-2xl">
              {product.documents.map((doc, idx) => (
                <li key={idx}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-3 p-4 transition-colors hover:border-primary-300"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-neutral-800">{doc.name}</span>
                    <Download className="ml-auto h-4 w-4 shrink-0 text-neutral-400" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions de produits similaires (même catégorie) */}
        {similarProducts.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Produits similaires</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Visionneuse plein écran, ouverte au clic sur l'image principale de la galerie */}
      {lightboxOpen && (
        <ImageLightbox
          images={product.images}
          activeIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActiveImage}
        />
      )}
    </div>
  );
}
