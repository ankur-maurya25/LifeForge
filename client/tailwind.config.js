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
          dark: '#090D16',
          surface: '#111827',
          card: '#161F33',
          border: '#243049',
          gold: '#F59E0B',
          'gold-glow': '#FDE68A',
          mana: '#3B82F6',
          crimson: '#EF4444',
          emerald: '#10B981',
          purple: '#8B5CF6',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glow-mana': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
      },
      keyframes: {
        'boss-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'boss-hit': 'boss-shake 0.35s ease-in-out',
        'float': 'float-slow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
