// Liste des commandes simulées (passées par les clients via le checkout public), avec
// possibilité de changer leur statut de suivi. Pas de logistique complexe : juste de quoi
// donner à l'admin une vue exploitable sur les commandes en cours.
import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/services/orderService';
import { formatPrice } from '@/utils/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import EmptyState from '@/components/EmptyState';

// Statuts possibles d'une commande, dans leur ordre logique de progression.
const STATUS_OPTIONS = ['Nouvelle', 'En préparation', 'Confirmée', 'Terminée', 'Annulée'];

// Couleur du badge de statut, pour repérer l'état d'une commande en un coup d'œil.
const STATUS_TONE = {
  'Nouvelle': 'bg-primary-50 text-primary-700',
  'En préparation': 'bg-accent-50 text-accent-700',
  'Confirmée': 'bg-success-50 text-success-600',
  'Terminée': 'bg-neutral-200 text-neutral-600',
  'Annulée': 'bg-error-50 text-error-600',
};

/**
 * Affiche la liste des commandes simulées et permet de mettre à jour leur statut.
 */
export default function AdminOrdersPage() {
  useDocumentTitle('Commandes | Administration AgriMarket');

  // Copie locale rafraîchie après chaque changement de statut (mêmes raisons que côté produits).
  const [orders, setOrders] = useState(() => getOrders());

  function handleStatusChange(orderId, status) {
    updateOrderStatus(orderId, status);
    setOrders(getOrders());
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Commandes</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {orders.length} commande{orders.length > 1 ? 's' : ''} simulée{orders.length > 1 ? 's' : ''} (passées depuis le site public).
      </p>

      {orders.length > 0 ? (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3">Commande</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Produits</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-medium text-neutral-800">#{o.orderId}</td>
                  <td className="px-4 py-3 text-neutral-600">{o.firstName} {o.lastName}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {o.items.length} article{o.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${STATUS_TONE[o.status] ?? 'bg-neutral-100 text-neutral-600'}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<ClipboardList className="h-8 w-8" />}
            title="Aucune commande pour le moment"
            description="Les commandes passées depuis le site public apparaîtront ici automatiquement."
          />
        </div>
      )}
    </div>
  );
}
