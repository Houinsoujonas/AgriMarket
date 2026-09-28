// Tableau de bord admin : chiffres clés calculés en direct depuis productService/orderService,
// plus les derniers produits et dernières commandes. Pas de graphique : juste des chiffres
// utiles, lisibles d'un coup d'œil (voir CLAUDE.md / brief : "pas de dashboard rempli de
// graphiques inutiles").
import { Link } from 'react-router-dom';
import { Package, CheckCircle2, AlertTriangle, ClipboardList, Wallet } from 'lucide-react';
import { getProducts } from '@/services/productService';
import { getOrders } from '@/services/orderService';
import { formatPrice } from '@/utils/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Affiche les statistiques principales de la boutique et les dernières activités.
 */
export default function AdminDashboardPage() {
  useDocumentTitle('Tableau de bord | Administration AgriMarket');

  const products = getProducts();
  const orders = getOrders();

  const inStockCount = products.filter((p) => p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Produits les plus récemment créés (même logique que la home publique, mais sur tout le catalogue).
  const lastProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // orderService.getOrders() trie déjà du plus récent au plus ancien.
  const lastOrders = orders.slice(0, 5);

  const stats = [
    { icon: Package, label: 'Produits au catalogue', value: products.length, tone: 'text-primary-600 bg-primary-50' },
    { icon: CheckCircle2, label: 'Produits en stock', value: inStockCount, tone: 'text-success-600 bg-success-50' },
    { icon: AlertTriangle, label: 'Produits en rupture', value: outOfStockCount, tone: 'text-error-600 bg-error-50' },
    { icon: ClipboardList, label: 'Commandes simulées', value: orders.length, tone: 'text-accent-600 bg-accent-50' },
    { icon: Wallet, label: 'Chiffre d\'affaires simulé', value: formatPrice(revenue), tone: 'text-primary-600 bg-primary-50' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Tableau de bord</h1>
      <p className="mt-1 text-sm text-neutral-500">Vue d'ensemble de l'activité AgriMarket.</p>

      {/* Cartes de statistiques */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="card p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xl font-bold text-neutral-900">{stat.value}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Derniers produits ajoutés */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Derniers produits</h2>
            <Link to="/admin/produits" className="text-xs font-medium text-primary-600 hover:underline">Voir tout</Link>
          </div>
          <ul className="mt-4 divide-y divide-neutral-100">
            {lastProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <img src={p.images[0]?.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.category}</p>
                </div>
                <span className="text-xs font-medium text-neutral-600">{formatPrice(p.price)}</span>
              </li>
            ))}
            {lastProducts.length === 0 && (
              <p className="py-4 text-center text-xs text-neutral-400">Aucun produit pour le moment.</p>
            )}
          </ul>
        </div>

        {/* Dernières commandes */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Dernières commandes</h2>
            <Link to="/admin/commandes" className="text-xs font-medium text-primary-600 hover:underline">Voir tout</Link>
          </div>
          <ul className="mt-4 divide-y divide-neutral-100">
            {lastOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">#{o.orderId} — {o.firstName} {o.lastName}</p>
                  <p className="text-xs text-neutral-400">{o.status}</p>
                </div>
                <span className="text-xs font-medium text-neutral-600">{formatPrice(o.total)}</span>
              </li>
            ))}
            {lastOrders.length === 0 && (
              <p className="py-4 text-center text-xs text-neutral-400">Aucune commande pour le moment.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
