// Verrou d'accès symbolique pour l'espace /admin.
//
// ATTENTION — DÉMONSTRATION UNIQUEMENT : ce mot de passe est écrit en clair dans le code
// source, envoyé et vérifié entièrement côté client, et ne protège donc RIEN de sérieux.
// Il ne remplace pas une authentification réelle (serveur, hachage, sessions signées...).
// Son seul but ici est de donner un aperçu réaliste de ce à quoi ressemblerait un espace
// d'administration protégé, pour une démonstration de portfolio. Une vraie authentification
// pourra être branchée plus tard sans changer la façon dont AdminGuard est utilisé (il
// suffira de remplacer la vérification ci-dessous par un appel à une API d'authentification).
import { useState } from 'react';
import { Lock } from 'lucide-react';
import Logo from '@/components/Logo';

// Mot de passe de démonstration (volontairement simple et visible : ce n'est PAS un secret).
const DEMO_PASSCODE = 'agrimarket2025';
const SESSION_KEY = 'agrimarket_admin_unlocked';

/**
 * Affiche le contenu protégé uniquement si le bon passcode a été saisi lors de cette session
 * de navigation (sessionStorage : redemandé si l'onglet est fermé et rouvert).
 * @param {{ children: import('react').ReactNode }} props
 */
export default function AdminGuard({ children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (passcode === DEMO_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true);
      setError('');
    } else {
      setError('Mot de passe incorrect.');
    }
  }

  if (unlocked) return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="card p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-center text-lg font-semibold text-neutral-900">Espace administrateur</h1>
          <p className="mt-1 text-center text-xs text-neutral-400">
            Accès de démonstration — non sécurisé pour un usage réel.
          </p>
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label htmlFor="passcode" className="label">Mot de passe</label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`input ${error ? 'border-error-400' : ''}`}
                placeholder="••••••••"
                autoFocus
              />
              {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">
              Accéder au tableau de bord
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
