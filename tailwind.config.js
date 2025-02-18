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
        'gradient-card': 'linear-gradient(135deg, rgba(47, 28, 84, 0.3) 0%, rgba(157, 78, 221, 0.1) 100%)',
      },
      transitionProperty: {
        'all': 'all',
      },
      boxShadow: {
        'accent': '0 0 10px var(--accent-primary)',
      },
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '40': '0.4',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-accent-primary/10',
    'bg-accent-primary/20',
    'border-accent-primary/20',
    'border-accent-neon/40',
    'shadow-accent-primary/10',
    'hover:bg-accent-primary/10',
    'hover:border-accent-neon/40',
    'hover:shadow-accent-primary/10'
  ]
}