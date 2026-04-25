/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D4FF',
          dark: '#00B8D4',
          light: '#00E5FF',
        },
        background: {
          DEFAULT: '#0A0E1A',
          light: '#111827',
          card: '#1F2937',
        },
        neon: {
          blue: '#00D4FF',
          cyan: '#00E5FF',
          purple: '#8B5CF6',
          green: '#10B981',
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF, 0 0 10px #00D4FF' },
          '100%': { boxShadow: '0 0 20px #00D4FF, 0 0 30px #00D4FF' },
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
