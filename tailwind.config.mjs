/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Couleurs MV selon STYLE.md
        'mv-cream': '#FBF8F1',
        'mv-forest': '#2A3D34',
        'mv-leaf': '#4A7C59',
        'mv-coral': '#E85D3A',
        'mv-plum': '#5A2A3D',

        // Alias pour compatibilité
        'gastro-cream': '#FBF8F1',
        'gastro-earth': '#2A3D34',
        'gastro-sage': '#4A7C59',
        'gastro-copper': '#E85D3A',
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