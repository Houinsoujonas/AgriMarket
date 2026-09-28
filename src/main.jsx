// Point d'entrée de l'application : monte le composant racine <App /> dans le DOM.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Recherche l'élément HTML avec l'id "root" (défini dans index.html) et y attache React.
// StrictMode active des vérifications supplémentaires en développement (sans effet en production).
// ErrorBoundary intercepte toute erreur de rendu imprévue pour éviter une page blanche.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
