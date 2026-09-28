// Petit hook sans dépendance externe pour définir le titre de l'onglet (document.title)
// et la meta description de chaque page — équivalent maison d'une librairie comme
// react-helmet, évitée ici pour ne pas ajouter de dépendance inutile à un besoin aussi simple.
import { useEffect } from 'react';

const DEFAULT_TITLE = 'AgriMarket — Équipements agricoles modernes';
const DEFAULT_DESCRIPTION = "AgriMarket — Boutique en ligne de matériel et équipements agricoles. Motoculteurs, motopompes, pulvérisateurs, outils et plus.";

/**
 * Met à jour le titre de l'onglet et la meta description pendant l'affichage du composant
 * qui l'appelle, puis restaure les valeurs par défaut au démontage.
 * @param {string} [title] - Titre spécifique à la page (sinon le titre par défaut est conservé).
 * @param {string} [description] - Description spécifique à la page (sinon la description par défaut est conservée).
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    if (title) document.title = title;

    let metaDescription;
    if (description) {
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', description);
    }

    // Au démontage (changement de page), on restaure les valeurs par défaut du site.
    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDescription) metaDescription.setAttribute('content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
