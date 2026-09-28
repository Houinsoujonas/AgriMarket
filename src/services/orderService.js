// Couche de service centralisant la persistance des commandes.
//
// Le checkout existant (CheckoutPage) continue de fonctionner exactement comme avant
// (validation, récapitulatif, génération du numéro de commande, WhatsApp) — ce service
// vient seulement, en plus, enregistrer chaque commande passée afin que l'espace admin
// puisse les consulter (dashboard + liste des commandes simulées).
const ORDERS_KEY = 'agrimarket_orders';

/** @returns {import('@/types').Order[]} Toutes les commandes actuellement enregistrées. */
function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // localStorage corrompu ou inaccessible : on repart d'une liste vide plutôt que de planter.
  }
  return [];
}

/** Persiste la liste de commandes fournie. @param {import('@/types').Order[]} orders */
function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Récupère toutes les commandes, les plus récentes en premier.
 * @returns {import('@/types').Order[]}
 */
export function getOrders() {
  return [...readOrders()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Enregistre une nouvelle commande (appelé une fois le formulaire de checkout validé).
 * @param {import('@/types').OrderInfo} orderInfo - Les informations de la commande déjà construites par CheckoutPage.
 * @returns {import('@/types').Order} La commande enregistrée (avec statut et date).
 */
export function addOrder(orderInfo) {
  /** @type {import('@/types').Order} */
  const order = {
    ...orderInfo,
    id: orderInfo.orderId,
    status: 'Nouvelle',
    createdAt: new Date().toISOString(),
  };
  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
  return order;
}

/**
 * Met à jour le statut d'une commande (utilisé depuis l'espace admin).
 * @param {string} id - Identifiant de la commande (orderId).
 * @param {import('@/types').OrderStatus} status - Le nouveau statut.
 * @returns {import('@/types').Order | undefined} La commande mise à jour, ou undefined si introuvable.
 */
export function updateOrderStatus(id, status) {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], status };
  writeOrders(orders);
  return orders[index];
}
