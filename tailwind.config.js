/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        star: {
          dark: '#0a0a0f',
          panel: '#0d1117',
          border: '#1e3a5f',
          gold: '#ffe81f',
          'gold-dim': '#c9a800',
          cyan: '#00d4ff',
          green: '#00ff88',
          yellow: '#ffd700',
          red: '#ff3333',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-down': 'fadeSlideDown 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up': 'fadeSlideUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'shake': 'shake 0.5s ease',
        'pulse-danger': 'pulseDanger 1s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { textShadow: '0 0 30px rgba(255,232,31,0.4), 0 0 60px rgba(255,232,31,0.2)' },
          '50%': { textShadow: '0 0 50px rgba(255,232,31,0.6), 0 0 100px rgba(255,232,31,0.4)' },
        },
        fadeSlideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        pulseDanger: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
