/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        dot1: {
          '0%, 33%': { opacity: 1 },
          '34%, 66%': { opacity: 0.66 },
          '67%, 100%': { opacity: 0.33 },
        },
        dot2: {
          '0%, 33%': { opacity: 0.33 },
          '34%, 66%': { opacity: 1 },
          '67%, 100%': { opacity: 0.66 },
        },
        dot3: {
          '0%, 33%': { opacity: 0.66 },
          '34%, 66%': { opacity: 0.33 },
          '67%, 100%': { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 1.5s linear infinite",
        'dot-1': 'dot1 1.2s infinite',
        'dot-2': 'dot2 1.2s infinite',
        'dot-3': 'dot3 1.2s infinite',
      },
      boxShadow: {
        'bottom-only': '0 2px 0px -1px rgba(0, 0, 0, 0.1)',
        'top-only': '0 -2px 0px -1px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
