// Contexte React qui gère l'affichage de notifications temporaires ("toasts")
// en bas de l'écran, par exemple pour confirmer l'ajout d'un produit au panier.
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, X, AlertCircle, Info } from 'lucide-react';

// Création du contexte. Valeur par défaut "null" tant qu'aucun ToastProvider n'est monté.
const ToastContext = createContext(null);

// Compteur global servant à générer un identifiant unique pour chaque toast affiché.
let toastId = 0;

/**
 * Fournisseur de contexte à placer autour de l'application pour permettre l'affichage
 * de notifications ("toasts") depuis n'importe quel composant via le hook useToast().
 * @param {{ children: import('react').ReactNode }} props
 */
export function ToastProvider({ children }) {
  // Liste des toasts actuellement affichés à l'écran.
  const [toasts, setToasts] = useState([]);

  // useCallback évite de recréer la fonction à chaque rendu (optimisation).
  const showToast = useCallback((message, type = 'success') => {
    // Génère un identifiant unique pour ce toast.
    const id = ++toastId;
    // Ajoute le nouveau toast à la fin de la liste.
    setToasts((prev) => [...prev, { id, message, type }]);
    // Retire automatiquement ce toast après 3 secondes.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Conteneur fixe en bas à droite de l'écran où s'empilent les toasts actifs */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Composant interne qui affiche une seule notification (icône + message + bouton fermer).
 * @param {{ toast: { id: number, message: string, type: 'success'|'error'|'info' }, onClose: () => void }} props
 */
function ToastItem({ toast, onClose }) {
  // Icône affichée selon le type de notification.
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-success-600" />,
    error: <AlertCircle className="h-5 w-5 text-error-600" />,
    info: <Info className="h-5 w-5 text-primary-600" />,
  };

  // Couleur de fond/bordure selon le type de notification.
  const bgClasses = {
    success: 'bg-white border-success-500/30',
    error: 'bg-white border-error-500/30',
    info: 'bg-white border-primary-500/30',
  };

  return (
    <div className={`flex items-center gap-3 rounded-xl border ${bgClasses[toast.type]} px-4 py-3 shadow-lg animate-slide-up min-w-[280px] max-w-sm`}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-neutral-800">{toast.message}</p>
      <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors" aria-label="Fermer">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Hook personnalisé pour déclencher l'affichage d'une notification depuis n'importe quel composant.
 * @returns {{ showToast: (message: string, type?: 'success'|'error'|'info') => void }}
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  // Sécurité : ce hook doit obligatoirement être utilisé à l'intérieur d'un <ToastProvider>.
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
