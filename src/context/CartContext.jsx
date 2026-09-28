// Contexte React qui gère l'état global du panier d'achat (ajout, suppression, quantités,
// calcul des totaux) et sa persistance dans le localStorage du navigateur.
import { createContext, useContext, useEffect, useReducer } from 'react';

// Clé utilisée pour sauvegarder/lire le panier dans le localStorage du navigateur.
const STORAGE_KEY = 'agrimarket_cart';

// Frais de livraison fixes appliqués dès qu'il y a au moins un article dans le panier.
const DELIVERY_FEE = 5000;

/**
 * Calcule l'état initial du panier en lisant directement le localStorage.
 * Cette fonction est passée à useReducer comme "initialiseur paresseux" : elle s'exécute
 * une seule fois, de façon synchrone, avant le tout premier rendu du composant.
 *
 * Pourquoi ne pas charger les données dans un useEffect à la place ? Parce que cela créait un
 * bug : un premier effect chargeait le panier sauvegardé (de façon asynchrone), tandis qu'un
 * second effect sauvegardait l'état courant à chaque changement. Au montage, ce second effect
 * s'exécutait avec l'état initial encore vide et écrasait le panier précédemment enregistré
 * avant que le chargement n'ait eu le temps de s'appliquer. Résultat : le panier semblait se
 * vider à chaque rechargement complet de la page. En lisant le localStorage ici, dès le calcul
 * de l'état initial, ce problème de timing disparaît complètement.
 * @returns {{ items: import('@/types').CartItem[] }} L'état initial du panier.
 */
function loadInitialCartState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { items: JSON.parse(raw) };
    }
  } catch {
    // Si le localStorage est corrompu ou inaccessible, on ignore simplement l'erreur.
  }
  return { items: [] };
}

/**
 * Réducteur (reducer) qui décrit comment l'état du panier change en fonction des actions reçues.
 * C'est le cœur de la logique métier du panier : chaque "case" correspond à une action possible.
 * @param {{ items: import('@/types').CartItem[] }} state - L'état actuel du panier.
 * @param {Object} action - L'action à appliquer (contient un champ "type").
 * @returns {{ items: import('@/types').CartItem[] }} Le nouvel état du panier.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      // On cherche si le produit est déjà présent dans le panier.
      const existing = state.items.find((item) => item.product.id === action.product.id);
      if (existing) {
        // Le produit existe déjà : on augmente simplement sa quantité.
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        };
      }
      // Nouveau produit : on l'ajoute à la fin de la liste des articles.
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      };
    }
    case 'REMOVE':
      // Supprime l'article correspondant à l'identifiant produit donné.
      return { items: state.items.filter((item) => item.product.id !== action.productId) };
    case 'UPDATE_QTY':
      // Si la nouvelle quantité est nulle ou négative, on retire l'article du panier.
      if (action.quantity <= 0) {
        return { items: state.items.filter((item) => item.product.id !== action.productId) };
      }
      // Sinon on met à jour la quantité de l'article concerné.
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case 'CLEAR':
      // Vide complètement le panier.
      return { items: [] };
    default:
      // Action inconnue : on ne change rien.
      return state;
  }
}

// Création du contexte React. La valeur par défaut est "null" tant qu'aucun CartProvider
// n'englobe le composant qui l'utilise (voir la vérification dans useCart()).
const CartContext = createContext(null);

/**
 * Fournisseur de contexte à placer autour de l'application pour donner accès au panier
 * (état + actions) à tous les composants enfants via le hook useCart().
 * @param {{ children: import('react').ReactNode }} props
 */
export function CartProvider({ children }) {
  // useReducer gère l'état du panier via le réducteur défini plus haut. Le troisième argument
  // (loadInitialCartState) est appelé une seule fois pour calculer l'état initial de façon
  // synchrone à partir du localStorage (voir le commentaire de cette fonction plus haut).
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialCartState);

  // À chaque changement des articles du panier, on sauvegarde l'état dans le localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  // Nombre total d'articles (somme des quantités), affiché par exemple dans l'icône panier.
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  // Sous-total : somme des (prix x quantité) de chaque article.
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // Les frais de livraison ne s'appliquent que si le panier n'est pas vide.
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  // Montant total à payer (sous-total + livraison).
  const total = subtotal + deliveryFee;

  // Valeur exposée à tous les composants via le contexte : données + fonctions d'action.
  const value = {
    items: state.items,
    addToCart: (product, quantity = 1) => dispatch({ type: 'ADD', product, quantity }),
    removeFromCart: (productId) => dispatch({ type: 'REMOVE', productId }),
    updateQuantity: (productId, quantity) => dispatch({ type: 'UPDATE_QTY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    totalItems,
    subtotal,
    deliveryFee,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook personnalisé pour accéder facilement au contexte du panier depuis n'importe quel composant.
 * @returns {{
 *   items: import('@/types').CartItem[],
 *   addToCart: (product: import('@/types').Product, quantity?: number) => void,
 *   removeFromCart: (productId: string) => void,
 *   updateQuantity: (productId: string, quantity: number) => void,
 *   clearCart: () => void,
 *   totalItems: number,
 *   subtotal: number,
 *   deliveryFee: number,
 *   total: number,
 * }}
 */
export function useCart() {
  const ctx = useContext(CartContext);
  // Sécurité : ce hook doit obligatoirement être utilisé à l'intérieur d'un <CartProvider>.
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
