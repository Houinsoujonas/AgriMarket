// Page de commande : formulaire de coordonnées, choix du mode de réception, puis
// confirmation avec envoi du récapitulatif via WhatsApp.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, MessageCircle, ArrowLeft, ShoppingBag,
  Truck, Store, User, Phone, Mail, MapPin,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  formatPrice, formatPriceShort, generateOrderId, resizeImage,
  buildOrderWhatsAppMessage, buildWhatsAppUrl,
} from '@/utils/format';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { addOrder } from '@/services/orderService';

/**
 * Affiche le tunnel de commande complet : formulaire, puis écran de confirmation.
 */
export default function CheckoutPage() {
  useDocumentTitle('Passer la commande | AgriMarket');
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Champs contrôlés du formulaire de commande.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  // Mode de réception choisi : livraison à domicile ou retrait en boutique.
  const [deliveryMode, setDeliveryMode] = useState('livraison');
  // Messages d'erreur de validation, indexés par nom de champ.
  const [errors, setErrors] = useState({});
  // Commande finalisée (affichée sur l'écran de confirmation), null tant que le formulaire n'est pas validé.
  const [order, setOrder] = useState(null);

  /**
   * Vérifie que tous les champs obligatoires du formulaire sont correctement remplis.
   * @returns {boolean} true si le formulaire est valide, false sinon.
   */
  function validate() {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!phone.trim()) newErrors.phone = 'Le téléphone est requis';
    // Vérifie que le téléphone ne contient que des chiffres et symboles autorisés (au moins 6 caractères).
    else if (!/^[0-9+\s()-]{6,}$/.test(phone.trim())) newErrors.phone = 'Numéro invalide';
    if (!city.trim()) newErrors.city = 'La ville est requise';
    // L'adresse n'est obligatoire que si le mode de réception est "livraison".
    if (deliveryMode === 'livraison' && !address.trim()) newErrors.address = "L'adresse est requise pour la livraison";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Gère la soumission du formulaire : valide les champs, construit la commande,
   * vide le panier et affiche l'écran de confirmation.
   * @param {import('react').FormEvent} e - L'événement de soumission.
   */
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // Génère un identifiant unique pour cette commande.
    const orderId = generateOrderId();
    /** @type {import('@/types').OrderInfo} */
    const orderInfo = {
      orderId,
      firstName,
      lastName,
      phone,
      email,
      city,
      address,
      comment,
      deliveryMode,
      items,
      subtotal,
      delivery: deliveryFee,
      total,
    };
    // Enregistre la commande pour qu'elle soit visible dans l'espace admin (/admin/commandes).
    // N'affecte en rien le flux existant : le panier, la validation et le message WhatsApp
    // fonctionnent exactement comme avant, cet appel ne fait qu'ajouter une trace persistée.
    addOrder(orderInfo);
    setOrder(orderInfo);
    clearCart();
    // Remonte en haut de page pour que l'utilisateur voie bien l'écran de confirmation.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Ouvre WhatsApp avec le récapitulatif complet de la commande pré-rempli.
   */
  function handleWhatsApp() {
    if (!order) return;
    const msg = buildOrderWhatsAppMessage({
      orderId: order.orderId,
      items: order.items,
      total: order.total,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      city: order.city,
      deliveryMode: order.deliveryMode,
    });
    window.open(buildWhatsAppUrl(msg), '_blank');
  }

  // === Écran de confirmation (affiché une fois la commande validée) ===
  if (order) {
    return (
      <div className="animate-fade-in">
        <div className="border-b border-neutral-200 bg-white">
          <div className="container-app py-6">
            <Breadcrumb items={[{ label: 'Commande', path: '/commande' }, { label: 'Confirmation' }]} />
          </div>
        </div>

        <div className="container-app py-12 lg:py-20">
          <div className="mx-auto max-w-2xl">
            <div className="card p-8 text-center lg:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600 animate-scale-in">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-neutral-900 sm:text-3xl">
                Commande enregistrée
              </h1>
              <p className="mt-3 text-sm text-neutral-500">
                Votre demande de commande{' '}
                <span className="font-semibold text-primary-700">#{order.orderId}</span>
                {' '}a bien été enregistrée. Pour finaliser votre achat, contactez-nous via WhatsApp.
              </p>

              {/* Récapitulatif détaillé de la commande (articles + montants + coordonnées) */}
              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-left">
                <h2 className="text-sm font-semibold text-neutral-900">Détails de la commande</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {order.items.map((item) => (
                    <li key={item.product.id} className="flex justify-between text-neutral-600">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-medium text-neutral-900">
                        {formatPriceShort(item.product.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="my-3 border-t border-neutral-200" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-neutral-500">
                    <span>Sous-total</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Livraison</span>
                    <span>{formatPrice(order.delivery)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-neutral-900">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="my-3 border-t border-neutral-200" />
                <div className="space-y-1 text-xs text-neutral-500">
                  <p><span className="font-medium text-neutral-700">Client :</span> {order.firstName} {order.lastName}</p>
                  <p><span className="font-medium text-neutral-700">Téléphone :</span> {order.phone}</p>
                  <p><span className="font-medium text-neutral-700">Ville :</span> {order.city}</p>
                  <p><span className="font-medium text-neutral-700">Mode :</span> {order.deliveryMode === 'livraison' ? 'Livraison' : 'Retrait en boutique'}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={handleWhatsApp} className="btn flex-1 bg-[#25D366] text-white hover:bg-[#1da851]">
                  <MessageCircle className="h-4 w-4" /> Contacter via WhatsApp
                </button>
                <Link to="/produits" className="btn-outline flex-1">
                  <ShoppingBag className="h-4 w-4" /> Retour à la boutique
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Garde-fou : panier vide (on ne peut pas commander sans articles) ===
  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="border-b border-neutral-200 bg-white">
          <div className="container-app py-6">
            <Breadcrumb items={[{ label: 'Commande' }]} />
          </div>
        </div>
        <div className="container-app py-16 lg:py-24">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Votre panier est vide"
            description="Ajoutez des produits à votre panier avant de passer commande."
            actionLabel="Voir les produits"
            actionLink="/produits"
          />
        </div>
      </div>
    );
  }

  // === Formulaire de commande (cas principal) ===
  return (
    <div className="animate-fade-in">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'Panier', path: '/panier' }, { label: 'Commande' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">Passer la commande</h1>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale : les différentes sections du formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Choix du mode de réception : livraison ou retrait en boutique */}
            <div className="card p-6">
              <h2 className="text-base font-semibold text-neutral-900">Mode de réception</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  deliveryMode === 'livraison' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="livraison"
                    checked={deliveryMode === 'livraison'}
                    onChange={() => setDeliveryMode('livraison')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <Truck className={`h-5 w-5 ${deliveryMode === 'livraison' ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <div>
                      <span className="block text-sm font-semibold text-neutral-900">Livraison</span>
                      <span className="text-xs text-neutral-500">Recevez votre commande à domicile</span>
                    </div>
                  </div>
                </label>
                <label className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  deliveryMode === 'retrait' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMode"
                    value="retrait"
                    checked={deliveryMode === 'retrait'}
                    onChange={() => setDeliveryMode('retrait')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <Store className={`h-5 w-5 ${deliveryMode === 'retrait' ? 'text-primary-600' : 'text-neutral-400'}`} />
                    <div>
                      <span className="block text-sm font-semibold text-neutral-900">Retrait en boutique</span>
                      <span className="text-xs text-neutral-500">Récupérez votre commande sur place</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Informations personnelles du client */}
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-base font-semibold text-neutral-900">Informations personnelles</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="label">Prénom <span className="text-error-500">*</span></label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`input ${errors.firstName ? 'border-error-400 focus:ring-error-500/20' : ''}`}
                    placeholder="Jean"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-error-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Nom <span className="text-error-500">*</span></label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`input ${errors.lastName ? 'border-error-400 focus:ring-error-500/20' : ''}`}
                    placeholder="Dupont"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-error-600">{errors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="label">Téléphone <span className="text-error-500">*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`input ${errors.phone ? 'border-error-400 focus:ring-error-500/20' : ''}`}
                    placeholder="+229 01 97 00 00 00"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-error-600">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="jean.dupont@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Adresse de livraison ou de retrait, selon le mode choisi */}
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="text-base font-semibold text-neutral-900">Adresse de {deliveryMode === 'livraison' ? 'livraison' : 'retrait'}</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="city" className="label">Ville <span className="text-error-500">*</span></label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`input ${errors.city ? 'border-error-400 focus:ring-error-500/20' : ''}`}
                    placeholder="Cotonou"
                  />
                  {errors.city && <p className="mt-1 text-xs text-error-600">{errors.city}</p>}
                </div>
                {/* Le champ adresse ne s'affiche que si le mode de réception est "livraison" */}
                {deliveryMode === 'livraison' && (
                  <div>
                    <label htmlFor="address" className="label">Adresse <span className="text-error-500">*</span></label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`input ${errors.address ? 'border-error-400 focus:ring-error-500/20' : ''}`}
                      placeholder="Quartier, rue, repère..."
                    />
                    {errors.address && <p className="mt-1 text-xs text-error-600">{errors.address}</p>}
                  </div>
                )}
                <div>
                  <label htmlFor="comment" className="label">Commentaire</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input min-h-[80px] resize-y"
                    placeholder="Informations complémentaires (optionnel)..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale : résumé de la commande + bouton de validation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              <h2 className="text-base font-semibold text-neutral-900">Résumé de la commande</h2>

              <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200">
                      <img src={resizeImage(item.product.images[0]?.url, 120)} alt={item.product.images[0]?.alt ?? item.product.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-neutral-900 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-neutral-400">{formatPriceShort(item.product.price)} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">
                      {formatPriceShort(item.product.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="my-4 border-t border-neutral-200" />

              <div className="space-y-2 text-sm">
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

              <button type="submit" className="btn-primary mt-6 w-full">
                <CheckCircle2 className="h-4 w-4" /> Confirmer la commande
              </button>

              <Link to="/panier" className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Retour au panier
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
