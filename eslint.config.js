// Configuration ESLint (analyse statique du code JavaScript/JSX pour détecter les erreurs
// et mauvaises pratiques). Le projet étant en JavaScript pur, on utilise uniquement les
// règles recommandées de base + les règles spécifiques à React (hooks, fast refresh).
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Ignore le dossier de build généré par Vite.
  { ignores: ['dist'] },
  {
    // Règles JavaScript de base recommandées par ESLint.
    ...js.configs.recommended,
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      // Les variables globales du navigateur (window, document, etc.) sont autorisées.
      globals: globals.browser,
      parserOptions: {
        // Active la compréhension de la syntaxe JSX (balises <Composant />) par le parseur.
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Règles qui vérifient le bon usage des hooks React (useState, useEffect, etc.).
      ...reactHooks.configs.recommended.rules,
      // Avertit si un fichier exporte autre chose qu'un composant (peut casser le Fast Refresh).
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
