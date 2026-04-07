/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primario': '#2D4059',
        'acento': '#0056b3',
        'fondo-suave': '#F4F4F4',
        'oscuro': '#1A1A1A',
      }
    },
  },
  plugins: [],
}