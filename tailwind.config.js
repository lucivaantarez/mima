/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'saturn-space': '#050510',
        'saturn-pink':  '#f2a7ca',
        'saturn-blue':  '#8fb8ed',
      },
      fontFamily: {
        sans:  ['var(--font-inter)',      'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia',   'serif'],
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1',    transform: 'scale(1)'   },
          '50%':      { opacity: '0.1',  transform: 'scale(0.5)' },
        },
        'twinkle-slow': {
          '0%, 100%': { opacity: '0.8',  transform: 'scale(1)'   },
          '50%':      { opacity: '0.1',  transform: 'scale(0.3)' },
        },
        'twinkle-fast': {
          '0%, 100%': { opacity: '1',    transform: 'scale(1.2)' },
          '50%':      { opacity: '0',    transform: 'scale(0.4)' },
        },
      },
      animation: {
        'twinkle':      'twinkle 3s ease-in-out infinite',
        'twinkle-slow': 'twinkle-slow 5s ease-in-out infinite',
        'twinkle-fast': 'twinkle-fast 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

