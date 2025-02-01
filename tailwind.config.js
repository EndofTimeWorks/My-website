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
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(47, 28, 84, 0.3) 0%, rgba(157, 78, 221, 0.1) 100%)',
        'gradient-hover': 'linear-gradient(135deg, rgba(157, 78, 221, 0.2) 0%, rgba(178, 73, 248, 0.1) 100%)',
      },
    },
  },
  plugins: [],
}
