/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Couleurs MV selon STYLE.md
        'mv-cream': 'var(--mv-cream)',
        'mv-forest': 'var(--mv-forest)',
        'mv-leaf': 'var(--mv-leaf)',
        'mv-coral': 'var(--mv-coral)',
        'mv-plum': 'var(--mv-plum)',

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