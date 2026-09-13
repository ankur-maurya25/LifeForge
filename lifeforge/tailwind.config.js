/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#07080D',
          surface: '#0E111A',
          card: '#141824',
          border: '#1E2538',
          crimson: '#DC2626',
          'crimson-bright': '#EF4444',
          'crimson-dark': '#7F1D1D',
          purple: '#9333EA',
          'purple-glow': '#A855F7',
          gold: '#F59E0B',
          'gold-glow': '#FBBF24',
        }
      },
      fontFamily: {
        rpg: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 35px -5px rgba(220, 38, 38, 0.45)',
        'glow-purple': '0 0 35px -5px rgba(147, 51, 234, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
      },
      keyframes: {
        'boss-hit': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        'boss-shake': 'boss-hit 0.35s ease-in-out',
        'float': 'float-slow 4s ease-in-out infinite',
        'ember-pulse': 'pulse-glow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
