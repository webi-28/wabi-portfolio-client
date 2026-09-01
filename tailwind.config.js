/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   '#2563EB',
        secondary: '#06B6D4',
        accent:    '#38BDF8',
        neon:      '#00F5FF',
        dark:      '#050B18',
        'dark-card': '#0D1627',
        'dark-border': '#1E2D45',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s infinite',
        'spin-slow':  'spin 10s linear infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradientX 4s ease infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                     to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        glow:      { from: { boxShadow: '0 0 10px rgba(37,99,235,0.3)' }, to: { boxShadow: '0 0 30px rgba(37,99,235,0.8)' } },
        gradientX: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(37,99,235,0.4)',
        'glow':     '0 0 20px rgba(37,99,235,0.5)',
        'glow-lg':  '0 0 40px rgba(37,99,235,0.6)',
        'glow-cyan':'0 0 20px rgba(6,182,212,0.5)',
        'inner-glow':'inset 0 0 20px rgba(37,99,235,0.1)',
      },
    },
  },
  plugins: [],
};
