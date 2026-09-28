// Logo officiel AgriMarket : recréation vectorielle (SVG) fidèle à la planche de marque
// (docs/design/agri-market-reference.png.png), car aucun fichier logo source séparé n'a été
// fourni. L'emblème reprend les éléments de la référence : badge triangulaire arrondi en
// dégradé vert, silhouette de tracteur stylisée, accent "panier" orange, feuille au sommet.
// Si un fichier logo officiel (SVG/PNG exporté) devient disponible, il pourra remplacer ce
// composant sans changer son API (mêmes props) utilisée par Header/Footer.

/**
 * Emblème seul (le badge triangulaire), sans texte — utilisé aux petites tailles
 * (favicon, icônes, espace admin réduit).
 * @param {{ className?: string }} props
 */
export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="AgriMarket">
      <defs>
        <linearGradient id="agrimarket-badge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fad6e" />
          <stop offset="100%" stopColor="#0b5e3b" />
        </linearGradient>
      </defs>
      {/* Badge triangulaire arrondi (forme "goutte") en dégradé vert */}
      <path d="M32,6 Q53,31 58,56 Q32,64 6,56 Q11,31 32,6 Z" fill="url(#agrimarket-badge)" />
      {/* Rangs de terre stylisés au pied du badge */}
      <path d="M14,52 Q32,47 50,52" stroke="#6b4f3b" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M16,56 Q32,52 48,56" stroke="#543d2d" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* Silhouette de tracteur, simplifiée en aplats clairs */}
      <g fill="#f5f7fa">
        <rect x="19" y="33" width="9" height="7" rx="1.5" />
        <rect x="19" y="39" width="19" height="5" rx="1.5" />
      </g>
      <circle cx="25" cy="47" r="6.5" fill="#0b5e3b" stroke="#f5f7fa" strokeWidth="2" />
      <circle cx="39" cy="48" r="4" fill="#0b5e3b" stroke="#f5f7fa" strokeWidth="2" />
      {/* Feuille au sommet du badge */}
      <path d="M32,10 C36,12 36,17 32,19 C28,17 28,12 32,10 Z" fill="#9fddb7" />
      {/* Accent "panier" orange, en bas à droite du badge */}
      <g transform="translate(44,44)">
        <path d="M0,0 L10,0 L8.5,6.5 L2,6.5 Z" fill="#ff8a00" />
        <circle cx="3" cy="9" r="1.4" fill="#ff8a00" />
        <circle cx="7.5" cy="9" r="1.4" fill="#ff8a00" />
      </g>
    </svg>
  );
}

/**
 * Logo complet AgriMarket : emblème + wordmark bicolore ("Agri" en vert, "Market" en orange).
 * @param {{
 *   className?: string,
 *   textClassName?: string,
 *   theme?: 'light'|'dark',
 *   showText?: boolean,
 * }} props
 * `theme` adapte la couleur du mot "Agri" selon que le logo est posé sur un fond clair
 * (header blanc) ou sombre (footer, hero) — "Market" reste orange dans les deux cas.
 */
export default function Logo({ className = 'h-9 w-9', textClassName = 'text-lg lg:text-xl', theme = 'light', showText = true }) {
  const agriColor = theme === 'dark' ? 'text-primary-400' : 'text-primary-800';
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={className} />
      {showText && (
        <span className={`font-bold tracking-tight ${textClassName}`}>
          <span className={agriColor}>Agri</span>
          <span className="text-accent-500">Market</span>
        </span>
      )}
    </span>
  );
}
