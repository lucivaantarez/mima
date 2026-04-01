/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'saturn-pink':  '#f2a7ca',
        'saturn-blue':  '#8fb8ed',
        'saturn-space': '#050510',
      },
      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
      },
      animation: {
        'spin-slow':     'spin 20s linear infinite',
        'pulse-gentle':  'pulseGentle 4s ease-in-out infinite',
        'drift':         'drift 8s ease-in-out infinite',
      },
      keyframes: {
        pulseGentle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.04)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
