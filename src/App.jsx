// Composant racine de l'application : met en place le routeur, les fournisseurs
// de contexte globaux (panier, notifications) et les deux arborescences de pages
// (le site public, avec Header/Footer, et l'espace /admin, avec sa propre mise en page).
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import ScrollToTop from '@/components/ScrollToTop';
import SiteLayout from '@/components/SiteLayout';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import CategoriesPage from '@/pages/CategoriesPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminGuard from '@/admin/AdminGuard';
import AdminLayout from '@/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminProductFormPage from '@/pages/admin/AdminProductFormPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

/**
 * Composant racine de l'application AgriMarket.
 * Définit l'ensemble des routes (pages) accessibles et les fournisseurs de contexte globaux.
 */
function App() {
  return (
    // BrowserRouter active la navigation par URL (sans rechargement de page).
    <BrowserRouter>
      {/* ToastProvider et CartProvider rendent les notifications et le panier
          accessibles depuis n'importe quel composant de l'application (site public ET admin). */}
      <ToastProvider>
        <CartProvider>
          {/* Remonte automatiquement en haut de page à chaque changement de route */}
          <ScrollToTop />
          <Routes>
            {/* Arborescence du site public : toutes ces pages partagent SiteLayout
                (en-tête + pied de page communs, injectés autour de chaque page via <Outlet />). */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/produits" element={<CatalogPage />} />
              <Route path="/produits/:id" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categorie/:slug" element={<CategoryPage />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/commande" element={<CheckoutPage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Route "catch-all" : toute URL non reconnue affiche la page 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Arborescence de l'espace administrateur : mise en page et navigation dédiées,
                protégées par AdminGuard (voir ce fichier pour les limites de cette protection). */}
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="produits" element={<AdminProductsPage />} />
              <Route path="produits/nouveau" element={<AdminProductFormPage />} />
              <Route path="produits/:id/modifier" element={<AdminProductFormPage />} />
              <Route path="commandes" element={<AdminOrdersPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
