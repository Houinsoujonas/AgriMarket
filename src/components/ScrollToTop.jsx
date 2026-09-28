// Composant utilitaire "invisible" : force le retour en haut de la page à chaque
// changement de route (sinon React Router conserve la position de défilement précédente).
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ne rend aucun élément visuel : remonte simplement la page en haut à chaque navigation.
 */
export default function ScrollToTop() {
  // Le chemin de l'URL actuelle ; change à chaque navigation entre les pages.
  const { pathname } = useLocation();

  // À chaque changement de "pathname", on remonte instantanément en haut de la page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Ce composant ne doit rien afficher à l'écran.
  return null;
}
