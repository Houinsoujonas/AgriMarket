// Page d'accueil : héros, catégories, produits populaires/promo/nouveaux, avantages
// et appel à l'action final. C'est la première page vue par les visiteurs.
import { Link } from 'react-router-dom';
import {
  ArrowRight, Truck, ShieldCheck, Headphones, CreditCard,
  Search, ShoppingCart, MessageCircle, CheckCircle2,
} from 'lucide-react';
import { getCategories, getPopularProducts, getPromoProducts, getNewProducts } from '@/services/productService';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';

/**
 * Affiche la page d'accueil de la boutique AgriMarket.
 */
export default function HomePage() {
  // Catégories affichées dans la section "Explorez nos rayons".
  const categories = getCategories();
  // Sélections de produits affichées dans les différentes sections de la page.
  const popularProducts = getPopularProducts(8);
  const promoProducts = getPromoProducts(4);
  const newProducts = getNewProducts(4);

  return (
    <div className="animate-fade-in">
      {/* === SECTION HÉROS (bannière principale) === */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* Image de fond semi-transparente */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/162371/tractor-round-baler-custom-work-hay-162371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 to-primary-700/40" />

        <div className="container-app relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-primary-100 backdrop-blur-sm border border-white/10">
              <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
              Équipements agricoles professionnels
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Tout l'équipement pour faire grandir votre activité agricole.
            </h1>
            <p className="mt-5 text-base text-primary-100 sm:text-lg lg:max-w-xl">
              Découvrez une sélection d'outils, machines et équipements agricoles adaptés à vos besoins.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/produits" className="btn-accent group">
                Voir les produits
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/produits" className="btn bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20">
                Découvrir les catégories
              </Link>
            </div>
          </div>
        </div>

        {/* Vague décorative en bas de la section héros */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f8faf9"/>
          </svg>
        </div>
      </section>

      {/* === SECTION CATÉGORIES === */}
      <section className="container-app py-16 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Catégories</span>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Explorez nos rayons</h2>
          <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto">
            Trouvez rapidement le matériel adapté à votre activité parmi nos différentes catégories.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* === SECTION PRODUITS POPULAIRES === */}
      <section className="bg-neutral-100/50 py-16 lg:py-20">
        <div className="container-app">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Best-sellers</span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Produits populaires</h2>
            </div>
            <Link to="/produits" className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:gap-2 transition-all sm:inline-flex">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION PROMOTIONS (affichée uniquement s'il y a des produits en promo) === */}
      {promoProducts.length > 0 && (
        <section className="container-app py-16 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-accent-600">Offres spéciales</span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Produits en promotion</h2>
            </div>
            <Link to="/produits" className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:gap-2 transition-all sm:inline-flex">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {promoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* === SECTION "POURQUOI AGRIMARKET" (avantages) === */}
      <section className="bg-neutral-900 py-16 lg:py-24">
        <div className="container-app">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-400">Nos avantages</span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Pourquoi choisir AgriMarket</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Tableau statique décrivant chaque avantage (icône, titre, description) */}
            {[
              { icon: ShieldCheck, title: 'Qualité garantie', desc: 'Des produits sélectionnés et testés pour leur durabilité et leur performance.' },
              { icon: Truck, title: 'Livraison rapide', desc: 'Livraison partout au Bénin dans les meilleurs délais, retrait en boutique possible.' },
              { icon: Headphones, title: 'Support dédié', desc: 'Une équipe à votre écoute pour vous conseiller sur le choix de votre matériel.' },
              { icon: CreditCard, title: 'Commande simplifiée', desc: 'Commandez en ligne et finalisez votre achat via WhatsApp en toute simplicité.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600/15 text-primary-400">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION "COMMENT COMMANDER" (étapes du parcours d'achat) === */}
      <section className="container-app py-16 lg:py-24">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Guide</span>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Comment commander</h2>
          <p className="mt-3 text-sm text-neutral-500 max-w-lg mx-auto">
            Quelques étapes simples pour passer votre commande en toute facilité.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Remarque : le texte contient une apostrophe ("l'équipement") -> chaîne entre guillemets doubles
              pour éviter de casser la syntaxe JavaScript (c'était une des erreurs corrigées dans ce fichier). */}
          {[
            { icon: Search, step: '01', title: 'Recherchez', desc: "Parcourez le catalogue et trouvez l'équipement dont vous avez besoin." },
            { icon: ShoppingCart, step: '02', title: 'Ajoutez au panier', desc: 'Sélectionnez vos produits et ajustez les quantités selon vos besoins.' },
            { icon: CheckCircle2, step: '03', title: 'Remplissez le formulaire', desc: 'Indiquez vos coordonnées et votre mode de réception préféré.' },
            { icon: MessageCircle, step: '04', title: 'Confirmez via WhatsApp', desc: 'Finalisez votre commande en un clic via WhatsApp.' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="card p-6">
                <span className="text-3xl font-bold text-primary-100">{item.step}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{item.desc}</p>
              </div>
              {/* Flèche de séparation entre les étapes, masquée après la dernière étape */}
              {idx < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 z-10 text-neutral-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* === SECTION NOUVEAUTÉS === */}
      <section className="bg-neutral-100/50 py-16 lg:py-20">
        <div className="container-app">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Récents</span>
              <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Produits récemment ajoutés</h2>
            </div>
            <Link to="/produits" className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:gap-2 transition-all sm:inline-flex">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION APPEL À L'ACTION FINAL === */}
      <section className="container-app py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 px-6 py-14 text-center lg:px-16 lg:py-20">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Prêt à équiper votre exploitation agricole ?
            </h2>
            <p className="mt-4 text-base text-primary-100 lg:text-lg">
              Parcourez notre catalogue complet et trouvez les outils, machines et équipements adaptés à vos besoins.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/produits" className="btn-accent group">
                Voir le catalogue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
