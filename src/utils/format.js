// Fonctions utilitaires de formatage (prix, identifiants, messages WhatsApp).
// Toutes les fonctions sont "pures" : elles ne modifient rien, elles retournent juste une valeur.

/**
 * Formate un prix en francs CFA avec séparateurs de milliers (ex : 425000 -> "425 000 FCFA").
 * @param {number} price - Le prix en nombre entier.
 * @returns {string} Le prix formaté avec le suffixe "FCFA".
 */
export function formatPrice(price) {
  // Intl.NumberFormat gère automatiquement les espaces entre milliers pour le format français.
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA';
}

/**
 * Formate un prix en version courte, avec juste "F" au lieu de "FCFA" (utile dans les petits espaces).
 * @param {number} price - Le prix en nombre entier.
 * @returns {string} Le prix formaté avec le suffixe "F".
 */
export function formatPriceShort(price) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' F';
}

/**
 * Transforme un texte libre en "slug" utilisable dans une URL (minuscules, sans accents, tirets).
 * @param {string} text - Le texte d'origine.
 * @returns {string} Le slug généré.
 */
export function slugify(text) {
  return text
    .toLowerCase() // tout en minuscules
    .normalize('NFD') // sépare les lettres accentuées de leurs accents (é -> e + ́)
    .replace(/[̀-ͯ]/g, '') // supprime les accents isolés
    .replace(/[^a-z0-9]+/g, '-') // remplace tout ce qui n'est pas alphanumérique par un tiret
    .replace(/(^-|-$)/g, ''); // enlève les tirets en début/fin de chaîne
}

/**
 * Génère un identifiant de commande aléatoire au format "AGR-XXXX".
 * @returns {string} L'identifiant généré.
 */
export function generateOrderId() {
  // Nombre aléatoire à 4 chiffres, entre 1000 et 9999 inclus.
  const num = Math.floor(1000 + Math.random() * 9000);
  return `AGR-${num}`;
}

/**
 * Demande à Pexels une version plus petite d'une image (les vignettes n'ont pas besoin
 * de 940 px de large : cela divise leur poids par 3 à 5). Les autres URL restent inchangées.
 * @param {string} url - L'URL de l'image d'origine.
 * @param {number} width - La largeur souhaitée en pixels.
 * @returns {string} L'URL redimensionnée.
 */
export function resizeImage(url, width) {
  if (!url || !url.includes('images.pexels.com')) return url;
  return url.replace(/&h=\d+/, '').replace(/w=\d+/, `w=${width}`);
}

// Numéro WhatsApp de la boutique (format international sans le "+").
const WHATSAPP_NUMBER = '2290197000000';

/**
 * Construit l'URL "wa.me" permettant d'ouvrir une conversation WhatsApp pré-remplie.
 * @param {string} message - Le message à pré-remplir.
 * @returns {string} L'URL WhatsApp complète.
 */
export function buildWhatsAppUrl(message) {
  // encodeURIComponent évite que les retours à la ligne ou caractères spéciaux cassent l'URL.
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Construit le message WhatsApp envoyé lors de la validation d'une commande complète (panier).
 * @param {{
 *   orderId: string,
 *   items: { product: { name: string }, quantity: number }[],
 *   total: number,
 *   firstName: string,
 *   lastName: string,
 *   phone: string,
 *   city: string,
 *   deliveryMode: string,
 * }} params - Les informations de la commande.
 * @returns {string} Le message formaté prêt à être envoyé.
 */
export function buildOrderWhatsAppMessage(params) {
  const { orderId, items, total, firstName, lastName, phone, city, deliveryMode } = params;

  // Construit la liste des articles sous forme "2x Nom du produit", une ligne par article.
  const itemsText = items
    .map((item) => `${item.quantity}x ${item.product.name}`)
    .join('\n');

  // Libellé lisible du mode de réception choisi par le client.
  const modeLabel = deliveryMode === 'livraison' ? 'Livraison' : 'Retrait';

  // Assemble le message final avec toutes les informations de la commande.
  return (
    `Bonjour AgriMarket,\n\n` +
    `Je souhaite passer une commande.\n\n` +
    `Commande : ${orderId}\n` +
    `Produits :\n${itemsText}\n\n` +
    `Total : ${formatPrice(total)}\n\n` +
    `Nom : ${firstName} ${lastName}\n` +
    `Téléphone : ${phone}\n` +
    `Ville : ${city}\n` +
    `Mode de réception : ${modeLabel}\n\n` +
    `Merci.`
  );
}

/**
 * Construit le message WhatsApp envoyé depuis la fiche produit (commande d'un seul produit).
 * @param {{ productName: string, quantity: number, price: number }} params - Infos du produit commandé.
 * @returns {string} Le message formaté prêt à être envoyé.
 */
export function buildProductWhatsAppMessage(params) {
  const { productName, quantity, price } = params;
  return (
    `Bonjour AgriMarket,\n\n` +
    `Je souhaite passer une commande.\n\n` +
    `Produit :\n` +
    `${quantity}x ${productName}\n\n` +
    `Total : ${formatPrice(price * quantity)}\n\n` +
    `Merci.`
  );
}
