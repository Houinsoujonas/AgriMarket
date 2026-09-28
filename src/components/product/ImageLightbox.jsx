// Visionneuse plein écran ("lightbox") pour zoomer sur les photos d'un produit.
// Ouverte au clic sur l'image principale de la galerie ; navigable au clavier et à la souris.
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Affiche une image en plein écran avec navigation précédent/suivant.
 * @param {{
 *   images: import('@/types').ProductImage[],
 *   activeIndex: number,
 *   onClose: () => void,
 *   onNavigate: (index: number) => void,
 * }} props
 */
export default function ImageLightbox({ images, activeIndex, onClose, onNavigate }) {
  const hasMultiple = images.length > 1;

  // Navigation au clavier : Échap pour fermer, flèches gauche/droite pour changer d'image.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMultiple) {
        onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
      }
      if (e.key === 'ArrowRight' && hasMultiple) {
        onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, hasMultiple, images.length, onClose, onNavigate]);

  const current = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Visionneuse d'image produit"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Fermer la visionneuse"
      >
        <X className="h-5 w-5" />
      </button>

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
          }}
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          aria-label="Image précédente"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <img
        src={current.url}
        alt={current.alt}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
          }}
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          aria-label="Image suivante"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {hasMultiple && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
