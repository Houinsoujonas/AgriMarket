// Pied de page affiché sur toutes les pages : logo, liens de navigation, catégories,
// coordonnées de contact et mention de copyright.
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';

/**
 * Affiche le pied de page global de l'application.
 */
export default function Footer() {
  // Année courante calculée dynamiquement pour la mention de copyright.
  const year = new Date().getFullYear();

  return (
    // Fond vert foncé (couleur de marque) plutôt qu'un simple gris neutre, pour se rapprocher
    // du bandeau sombre de la maquette officielle.
    <footer className="border-t border-primary-900 bg-primary-950 text-neutral-300">
      <div className="container-app py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Bloc marque : logo, description et réseaux sociaux */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/">
              <Logo theme="dark" textClassName="text-lg" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Votre boutique en ligne dédiée aux équipements et matériels agricoles. Des produits de qualité pour faire grandir votre activité.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary-600 hover:text-white" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary-600 hover:text-white" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-colors hover:bg-primary-600 hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Bloc liens de navigation principaux */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-neutral-400 transition-colors hover:text-primary-400">Accueil</Link></li>
              <li><Link to="/produits" className="text-neutral-400 transition-colors hover:text-primary-400">Tous les produits</Link></li>
              <li><Link to="/categories" className="text-neutral-400 transition-colors hover:text-primary-400">Catégories</Link></li>
              <li><Link to="/a-propos" className="text-neutral-400 transition-colors hover:text-primary-400">À propos</Link></li>
              <li><Link to="/contact" className="text-neutral-400 transition-colors hover:text-primary-400">Contact</Link></li>
            </ul>
          </div>

          {/* Bloc liens vers quelques catégories et le panier */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Nos rayons</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/categorie/traitement" className="text-neutral-400 transition-colors hover:text-primary-400">Traitement</Link></li>
              <li><Link to="/categorie/outils" className="text-neutral-400 transition-colors hover:text-primary-400">Outils</Link></li>
              <li><Link to="/categorie/protection" className="text-neutral-400 transition-colors hover:text-primary-400">Protection</Link></li>
              <li><Link to="/panier" className="text-neutral-400 transition-colors hover:text-primary-400">Mon panier</Link></li>
            </ul>
          </div>

          {/* Bloc coordonnées de contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-neutral-400">+229 01 97 00 00 00</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-neutral-400">contact@agrimarket.bj</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-neutral-400">Cotonou, Bénin</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-neutral-400">Lun - Sam : 8h - 18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de copyright en bas de page, avec l'année générée automatiquement */}
        <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
          <p>© {year} AgriMarket — Concept e-commerce. Projet portfolio. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
