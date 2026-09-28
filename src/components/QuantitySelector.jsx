// Sélecteur de quantité réutilisable (boutons -/+ et champ de saisie), utilisé
// dans le panier, la commande et la fiche produit.
import { Minus, Plus } from 'lucide-react';

/**
 * Affiche un sélecteur de quantité avec bornes min/max.
 * @param {{
 *   quantity: number,
 *   onIncrease: () => void,
 *   onDecrease: () => void,
 *   onChange?: (value: number) => void,
 *   min?: number,
 *   max?: number,
 *   size?: 'sm'|'md',
 * }} props
 */
export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}) {
  // Classes CSS adaptées selon la taille demandée (petite ou moyenne).
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="inline-flex items-center rounded-xl border border-neutral-300 bg-white">
      {/* Bouton pour diminuer la quantité, désactivé si on est déjà au minimum */}
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`flex ${btnSize} items-center justify-center rounded-l-xl text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Diminuer la quantité"
      >
        <Minus className={iconSize} />
      </button>
      <input
        type="text"
        value={quantity}
        onChange={(e) => {
          // Convertit la saisie en nombre entier, et ignore les valeurs non numériques.
          const val = parseInt(e.target.value, 10);
          if (onChange && !isNaN(val)) onChange(Math.max(min, Math.min(max, val)));
        }}
        className={`w-10 border-x border-neutral-200 text-center ${textSize} font-semibold text-neutral-900 focus:outline-none`}
        aria-label="Quantité"
        readOnly={!onChange}
      />
      {/* Bouton pour augmenter la quantité, désactivé si on est déjà au maximum */}
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`flex ${btnSize} items-center justify-center rounded-r-xl text-neutral-600 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Augmenter la quantité"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
