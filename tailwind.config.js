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
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(47, 28, 84, 0.2) 0%, rgba(157, 78, 221, 0.05) 100%)',
      },
      opacity: {
        '5': '0.05',
        '10': '0.1',
      },
    },
  },
  plugins: [],
}