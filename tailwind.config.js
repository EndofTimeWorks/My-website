/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-primary': '#1a0b2e',
        'background-secondary': '#2f1c54',
        'accent-primary': '#9d4edd',
        'accent-neon': '#b249f8',
        'text-glow': '#e0aaff',
        'text-primary': '#ffffff',
        'dark-accent': '#240046',
        'fox-pink': '#ffc6e5',
        'fox-pink-glow': '#ffadd6',
        'fox-orange': '#ff9466',
        'fox-white': '#fff5f9',
      },
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wag': 'wag 1s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px var(--accent-neon))' },
          '50%': { filter: 'drop-shadow(0 0 8px var(--accent-neon))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wag: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
    },
  },
  plugins: [],
}
