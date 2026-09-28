// Page "À propos" : présentation d'AgriMarket, mission et engagements envers les clients.
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, Sprout, ArrowRight } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Engagements affichés sous forme de cartes (repris de la charte de marque AgriMarket).
const commitments = [
  { icon: ShieldCheck, title: 'Produits de qualité et garantis', desc: 'Chaque équipement est sélectionné pour sa robustesse et sa fiabilité sur le terrain.' },
  { icon: Truck, title: 'Livraison rapide partout au Bénin', desc: 'Une logistique pensée pour vous livrer où que vous soyez, dans les meilleurs délais.' },
  { icon: Headphones, title: 'Service client disponible', desc: 'Une équipe à votre écoute pour vous conseiller avant, pendant et après votre achat.' },
  { icon: Sprout, title: 'Soutien à une agriculture durable', desc: 'Des solutions qui accompagnent une agriculture plus productive et plus responsable.' },
];

/**
 * Affiche la page "À propos" : mission d'AgriMarket et engagements envers les clients.
 */
export default function AboutPage() {
  useDocumentTitle('À propos | AgriMarket', "Découvrez la mission d'AgriMarket et nos engagements envers les exploitants agricoles.");
  return (
    <div className="animate-fade-in">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container-app py-6">
          <Breadcrumb items={[{ label: 'À propos' }]} />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">À propos d'AgriMarket</h1>
        </div>
      </div>

      {/* Mission */}
      <section className="container-app py-12 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Notre mission</span>
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            Ensemble pour une agriculture plus productive
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            AgriMarket est une boutique en ligne dédiée aux équipements et matériels agricoles.
            Notre objectif est simple : donner aux exploitants, qu'ils soient débutants ou
            professionnels confirmés, un accès facile à du matériel fiable — machines, irrigation,
            traitement, outillage et équipements de protection — pour faire grandir leur activité
            en toute confiance.
          </p>
        </div>
      </section>

      {/* Engagements */}
      <section className="bg-neutral-100/50 py-12 lg:py-16">
        <div className="container-app">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-600">Nos engagements</span>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Pourquoi nous faire confiance</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((item, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 px-6 py-12 text-center lg:px-16 lg:py-16">
          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Une question avant de commander ?
            </h2>
            <p className="mt-3 text-sm text-primary-100">
              Notre équipe est disponible pour vous conseiller sur le choix de votre matériel.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
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
