// Filet de sécurité global : si un composant plante pendant le rendu (erreur JavaScript
// imprévue), on affiche un message clair plutôt qu'une page blanche. Les "error boundaries"
// React doivent obligatoirement être des composants classe (pas de hook équivalent).
import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Appelé par React dès qu'une erreur est levée pendant le rendu d'un composant descendant.
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Journalise l'erreur dans la console pour faciliter le débogage (pas d'envoi externe ici).
  componentDidCatch(error, info) {
    console.error('Erreur applicative interceptée :', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-neutral-900">Une erreur est survenue</h1>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Veuillez réessayer. Si le problème persiste, revenez à l'accueil.
            </p>
            <button onClick={() => window.location.assign('/')} className="btn-primary mt-6">
              <RotateCcw className="h-4 w-4" /> Retour à l'accueil
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
