/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },

      colors: {
        // ── Brand (primary dark color) ─────────────────────────────────────
        // All values are CSS-variable–backed so the entire brand color
        // changes by editing --brand-* in globals.css.
        brand: {
          50:  'rgb(var(--brand-50)  / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          950: 'rgb(var(--brand-950) / <alpha-value>)',
        },

        // ── Accent (gold / highlight color) ───────────────────────────────
        accent: {
          light:   'rgb(var(--accent-light)   / <alpha-value>)', // subtle tint, e.g. amber-100
          muted:   'rgb(var(--accent-muted)   / <alpha-value>)', // on dark bg, e.g. amber-300
          DEFAULT: 'rgb(var(--accent)         / <alpha-value>)', // main, e.g. amber-400
          hover:   'rgb(var(--accent-hover)   / <alpha-value>)', // button hover, e.g. amber-500
          dark:    'rgb(var(--accent-dark)    / <alpha-value>)', // labels on light, e.g. amber-600
          text:    'rgb(var(--accent-text)    / <alpha-value>)', // highest contrast text, e.g. amber-800
        },

        // ── Surface (page background colors) ──────────────────────────────
        surface: {
          DEFAULT: 'rgb(var(--surface)     / <alpha-value>)', // white
          alt:     'rgb(var(--surface-alt) / <alpha-value>)', // cream #faf8f4
        },
      },
    },
  },
  plugins: [],
};
