/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        slate: colors.slate,
        amber: colors.amber,
        lime: colors.lime,
        green: colors.green,
        teal: colors.teal,
        sky: colors.sky,
        blue: colors.blue,
        violet: colors.violet,
        fuschia: colors.fuschia,
        pink: colors.pink,
        stone: colors.stone,

        // Custom design token mapping
        'bg-primary': 'var(--bg-primary)',
        'bg-primary-mainbar': 'var(--bg-primary-mainbar)',
        'bg-primary-sidebar': 'var(--bg-primary-sidebar)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-secondary-sidebar': 'var(--bg-secondary-sidebar)',
        'bg-auth': 'var(--bg-auth)',
        'bg-modal': 'var(--bg-modal)',
        'bg-dropdown': 'var(--bg-dropdown)',
        'bg-header': 'var(--bg-header)',
        'bg-nav': 'var(--bg-nav)',

        heading: 'var(--heading)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',

        'b-border': 'var(--b-border)',
        'input-bg': 'var(--input-bg)',
        'input-border': 'var(--input-border)',
        'input-text': 'var(--input-text)',
        'placeholder-text': 'var(--placeholder-text)',

        'nav-default': 'var(--nav-default)',
        'nav-hover': 'var(--nav-hover)',
        'nav-active': 'var(--nav-active)',

        'icon-default': 'var(--icon-default)',
        'icon-hover': 'var(--icon-hover)',

        'toggle-bg': 'var(--toggle-bg)',
        'toggle-btn': 'var(--toggle-btn)',

        'btn-primary': 'var(--btn-primary)',
        'btn-primary-hover': 'var(--btn-primary-hover)',
        'btn-primary-text': 'var(--btn-primary-text)',
        'btn-secondary-border': 'var(--btn-secondary-border)',
        'btn-secondary-hover': 'var(--btn-secondary-hover)',
        'btn-secondary-text': 'var(--btn-secondary-text)',
        'btn-tertiary-border': 'var(--btn-tertiary-border)',
        'btn-tertiary-hover': 'var(--btn-tertiary-hover)',
        'btn-tertiary-text': 'var(--btn-tertiary-text)',
        'btn-warning-hover': 'var(--btn-warning-hover)',
        'btn-warning-text': 'var(--btn-warning-text)',
        'btn-ghost': 'var(--btn-ghost)',
        'btn-ghost-hover': 'var(--btn-ghost-hover)',
        'btn-wide': 'var(--btn-wide)',
        'btn-wide-hover': 'var(--btn-wide-hover)',


      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}