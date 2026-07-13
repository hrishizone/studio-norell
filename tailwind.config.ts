import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/sections/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, architectural, timeless palette for Studio Noréll.
        bone: {
          DEFAULT: '#F4F1EA',
          50: '#FBFAF6',
          100: '#F4F1EA',
          200: '#EAE4D8',
          300: '#DBD2C0',
        },
        espresso: {
          DEFAULT: '#1A1613',
          soft: '#2A241F',
          muted: '#4A423B',
        },
        clay: {
          DEFAULT: '#B4795A',
          soft: '#C79378',
          deep: '#8F5B40',
        },
        sage: {
          DEFAULT: '#8A8B7C',
          soft: '#A6A796',
        },
        stone: {
          DEFAULT: '#CFC7B8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid editorial scale.
        'display-xl': ['clamp(3.5rem, 12vw, 13rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.75rem, 8vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
      },
      letterSpacing: {
        eyebrow: '0.32em',
        wide: '0.18em',
      },
      transitionTimingFunction: {
        // Signature easing used across the site.
        norell: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'norell-in': 'cubic-bezier(0.62, 0, 0.36, 1)',
      },
      boxShadow: {
        soft: '0 30px 80px -40px rgba(26, 22, 19, 0.45)',
        card: '0 40px 120px -50px rgba(26, 22, 19, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
