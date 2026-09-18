/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          500: '#7c3aed',
          600: '#6d28d9',
          900: '#07111f',
        },
        dark: {
          bg: '#07111f',
          card: '#0d1b2e',
          border: 'rgba(255, 255, 255, 0.08)',
          muted: '#8b9bb4',
        }
      }
    },
  },
  plugins: [],
}
