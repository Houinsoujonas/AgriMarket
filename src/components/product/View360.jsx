// Vue à 360° d'un produit : l'utilisateur glisse horizontalement pour faire tourner
// une séquence d'images. Ce composant n'est rendu que si product.view360 contient
// réellement une séquence d'images (voir ProductDetailPage) — jamais de rotation simulée
// à partir de photos qui ne forment pas une vraie séquence.
import { useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';

// Nombre de pixels de glissement nécessaires pour avancer d'une image de la séquence.
const DRAG_SENSITIVITY = 12;

/**
 * @param {{ images: string[], name: string }} props - La séquence d'images à parcourir
 * et le nom du produit (pour le texte alternatif).
 */
export default function View360({ images, name }) {
  const [frame, setFrame] = useState(0);
  const dragState = useRef({ dragging: false, startX: 0, lastFrame: 0 });

  /** Calcule la nouvelle frame à partir de la distance glissée, avec un rebouclage circulaire. */
  function frameFromDelta(deltaX) {
    const steps = Math.round(deltaX / DRAG_SENSITIVITY);
    const next = (dragState.current.lastFrame - steps) % images.length;
    return next < 0 ? next + images.length : next;
  }

  function handlePointerDown(e) {
    dragState.current = { dragging: true, startX: e.clientX, lastFrame: frame };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!dragState.current.dragging) return;
    setFrame(frameFromDelta(e.clientX - dragState.current.startX));
  }

  function handlePointerUp() {
    dragState.current.dragging = false;
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <img
        src={images[frame]}
        alt={`${name} — vue à 360°, image ${frame + 1}/${images.length}`}
        className="h-full w-full select-none object-cover"
        draggable={false}
      />
      <span className="absolute left-4 top-4 badge bg-neutral-900/80 text-white shadow-md">
        <RotateCw className="h-3.5 w-3.5" /> Vue 360°
      </span>
      {/* Surface de glissement invisible par-dessus l'image : capte souris ET tactile */}
      <div
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        role="slider"
        aria-label="Faites glisser pour faire pivoter le produit"
        aria-valuemin={1}
        aria-valuemax={images.length}
        aria-valuenow={frame + 1}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setFrame((f) => (f === 0 ? images.length - 1 : f - 1));
          if (e.key === 'ArrowRight') setFrame((f) => (f === images.length - 1 ? 0 : f + 1));
        }}
      />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
        Faites glisser pour tourner
      </div>
    </div>
  );
}
