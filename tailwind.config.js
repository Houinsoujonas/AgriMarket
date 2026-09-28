/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Palette officielle AgriMarket (voir CLAUDE.md et docs/design/agri-market-reference.png.png).
        // primary-600 = "Vert" (#22A447, actions/liens/boutons) ; primary-900 = "Vert foncé"
        // (#0B5E3B, fonds sombres : hero/header/footer). Les autres teintes sont interpolées
        // pour obtenir une échelle Tailwind complète et cohérente autour de ces deux ancres.
        primary: {
          50: '#eaf7ef',
          100: '#cfeeda',
          200: '#9fddb7',
          300: '#6bc891',
          400: '#3fad6e',
          500: '#2b9955',
          600: '#22a447',
          700: '#1b7d38',
          800: '#156530',
          900: '#0b5e3b',
          950: '#07331d',
        },
        // "Orange" de la charte (#FF8A00), utilisé pour les CTA et les mises en avant.
        accent: {
          50: '#fff6e8',
          100: '#ffe9c7',
          200: '#ffd08c',
          300: '#ffb755',
          400: '#ff9e29',
          500: '#ff8a00',
          600: '#e67a00',
          700: '#bf6600',
          800: '#995200',
          900: '#7a4200',
          950: '#452500',
        },
        // "Marron" de la charte (#6B4F3B) — usage ponctuel (icône catégorie Outils, petits accents).
        brown: {
          50: '#f7f2ee',
          100: '#ede1d8',
          200: '#dcc5b3',
          300: '#c6a488',
          400: '#a67f60',
          500: '#8a6449',
          600: '#6b4f3b',
          700: '#543d2d',
          800: '#402e22',
          900: '#2e2118',
          950: '#1a130e',
        },
        // "Gris clair" de la charte (#F5F7FA) en fond (50), reste de l'échelle en gris neutre froid.
        neutral: {
          50: '#f5f7fa',
          100: '#ebeef2',
          200: '#dce1e7',
          300: '#c3cbd3',
          400: '#9aa5b1',
          500: '#778394',
          600: '#5c6674',
          700: '#454e5a',
          800: '#333a44',
          900: '#262c33',
          950: '#171b20',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
