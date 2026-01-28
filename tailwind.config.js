/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Couleurs MV selon STYLE.md
        'mv-cream': {
          DEFAULT: 'var(--mv-cream)',
          50: 'rgba(251, 248, 241, 0.5)',
          80: 'rgba(251, 248, 241, 0.8)',
        },
        'mv-forest': {
          DEFAULT: 'var(--mv-forest)',
          50: 'rgba(42, 61, 52, 0.5)',
          60: 'rgba(42, 61, 52, 0.6)',
          70: 'rgba(42, 61, 52, 0.7)',
          80: 'rgba(42, 61, 52, 0.8)',
        },
        'mv-leaf': {
          DEFAULT: 'var(--mv-leaf)',
          10: 'rgba(74, 124, 89, 0.1)',
          20: 'rgba(74, 124, 89, 0.2)',
          30: 'rgba(74, 124, 89, 0.3)',
          40: 'rgba(74, 124, 89, 0.4)',
          80: 'rgba(74, 124, 89, 0.8)',
        },
        'mv-coral': {
          DEFAULT: 'var(--mv-coral)',
          20: 'rgba(232, 93, 58, 0.2)',
          30: 'rgba(232, 93, 58, 0.3)',
          50: 'rgba(232, 93, 58, 0.5)',
          80: 'rgba(232, 93, 58, 0.8)',
        },
        'mv-plum': {
          DEFAULT: 'var(--mv-plum)',
        },

        // Alias pour compatibilité
        'gastro-cream': 'var(--mv-cream)',
        'gastro-earth': 'var(--mv-forest)',
        'gastro-sage': 'var(--mv-leaf)',
        'gastro-copper': 'var(--mv-coral)',
      },
      fontFamily: {
        // Typographie selon STYLE.md
        'serif': ['Lora', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}