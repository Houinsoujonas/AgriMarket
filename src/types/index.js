// Ce fichier ne contient plus d'interfaces TypeScript (le projet est en JavaScript pur).
// Il sert uniquement de documentation : les blocs @typedef ci-dessous décrivent la forme
// des objets utilisés dans l'application, pour que les éditeurs (VS Code, etc.) puissent
// proposer de l'autocomplétion via JSDoc, sans imposer de vérification stricte de types.

/**
 * Représente une image de produit (photo de la galerie).
 * @typedef {Object} ProductImage
 * @property {string} url - URL de l'image.
 * @property {string} alt - Texte alternatif (accessibilité).
 * @property {number} order - Position d'affichage dans la galerie (1 = principale).
 */

/**
 * Représente un document téléchargeable associé à un produit (fiche technique, manuel...).
 * @typedef {Object} ProductDocument
 * @property {string} name - Nom lisible du document (ex : "Fiche technique").
 * @property {string} url - URL du fichier (PDF, etc.).
 * @property {string} [type] - Type de document (ex : "pdf", "brochure", "manuel").
 */

/**
 * Représente un produit du catalogue AgriMarket.
 *
 * Remarque : les champs marqués optionnels ci-dessous ne sont volontairement PAS
 * renseignés sur tous les produits — une pompe d'irrigation n'a pas de vidéo juste
 * pour "remplir" la fiche. Un champ absent = section non affichée côté fiche produit
 * (voir ProductDetailPage), jamais de contenu inventé à la place.
 * @typedef {Object} Product
 * @property {string} id - Identifiant unique du produit.
 * @property {string} name - Nom affiché du produit.
 * @property {string} slug - Version "URL-friendly" du nom.
 * @property {string} [sku] - Référence interne (générée), pas une donnée officielle fabricant.
 * @property {string} [brand] - Marque du produit, si connue/pertinente.
 * @property {string} [model] - Modèle précis du produit, si connu/pertinent.
 * @property {string} category - Nom lisible de la catégorie.
 * @property {string} categorySlug - Slug de la catégorie associée.
 * @property {number} price - Prix actuel en FCFA.
 * @property {number} [oldPrice] - Ancien prix (si le produit est en promotion).
 * @property {ProductImage[]} images - Galerie de photos du produit.
 * @property {string} description - Description longue du produit.
 * @property {string} shortDescription - Description courte (résumé).
 * @property {Record<string, string>} specifications - Tableau clé/valeur des caractéristiques techniques (varie librement selon la catégorie).
 * @property {number} stock - Quantité disponible en stock.
 * @property {number} rating - Note moyenne (sur 5).
 * @property {number} reviews - Nombre d'avis clients.
 * @property {'promo'|'nouveau'|'populaire'} [badge] - Étiquette marketing optionnelle.
 * @property {string} createdAt - Date de création au format ISO (YYYY-MM-DD).
 * @property {string} [videoUrl] - URL d'une vidéo de présentation, si disponible.
 * @property {string[]} [view360] - Séquence d'images pour une vue à 360°, si disponible.
 * @property {ProductDocument[]} [documents] - Documents téléchargeables (fiche technique, manuel...).
 */

/**
 * Représente une catégorie de produits.
 * @typedef {Object} Category
 * @property {string} id - Identifiant unique de la catégorie.
 * @property {string} name - Nom affiché de la catégorie.
 * @property {string} slug - Version "URL-friendly" du nom.
 * @property {string} description - Description courte de la catégorie.
 * @property {string} icon - Nom de l'icône Lucide associée.
 * @property {string} image - URL de l'image d'illustration.
 */

/**
 * Représente une ligne du panier (un produit + une quantité).
 * @typedef {Object} CartItem
 * @property {Product} product - Le produit concerné.
 * @property {number} quantity - Quantité choisie par le client.
 */

/**
 * Représente les informations d'une commande finalisée.
 * @typedef {Object} OrderInfo
 * @property {string} orderId - Identifiant généré pour la commande.
 * @property {string} firstName - Prénom du client.
 * @property {string} lastName - Nom du client.
 * @property {string} phone - Numéro de téléphone du client.
 * @property {string} email - Adresse email du client.
 * @property {string} city - Ville de livraison/retrait.
 * @property {string} address - Adresse précise (si livraison).
 * @property {string} comment - Commentaire libre du client.
 * @property {'livraison'|'retrait'} deliveryMode - Mode de réception choisi.
 * @property {CartItem[]} items - Liste des articles commandés.
 * @property {number} subtotal - Sous-total (hors livraison).
 * @property {number} delivery - Frais de livraison.
 * @property {number} total - Montant total de la commande.
 */

/**
 * Statuts possibles d'une commande côté administration.
 * @typedef {'Nouvelle'|'En préparation'|'Confirmée'|'Terminée'|'Annulée'} OrderStatus
 */

/**
 * Représente une commande telle que persistée par orderService (OrderInfo + suivi admin).
 * @typedef {OrderInfo & { id: string, status: OrderStatus, createdAt: string }} Order
 */

export {};
