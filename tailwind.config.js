/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rail: {
          950: '#030F1A',
          900: '#051F33',
          800: '#0B2740',
          700: '#123351',
          600: '#1B4569',
          border: 'rgba(255,255,255,0.08)',
        },
        navy: '#00355B',
        tangerine: '#FFCF00',
        canary: '#FFED00',
        ok: '#2FBF71',
        critical: '#FF5252',
        maint: '#7B8FA1',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,207,0,0.35), 0 0 24px rgba(255,207,0,0.15)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.9' },
          '70%': { transform: 'scale(1.9)', opacity: '0' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
    },
  },
  plugins: [],
}
