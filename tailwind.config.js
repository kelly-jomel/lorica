/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06080D',
          900: '#0B0F17',
          850: '#101622',
          800: '#161E2E',
          700: '#212B3E',
          600: '#324059',
        },
        gold: {
          100: '#FBF5E8',
          200: '#F4E5BE',
          300: '#EBD190',
          400: '#E2BA5F',
          500: '#D4AF37', // Liturgical sacred gold
          600: '#B89225',
          700: '#8E6F18',
        },
        candle: {
          flame: '#FF9533',
          glow: '#FF5E00',
          amber: '#FFB049',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        reading: ['Lora', 'Merriweather', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-0.5deg)', opacity: '0.92' },
          '25%': { transform: 'scale(1.04, 0.98) rotate(0.8deg)', opacity: '1' },
          '50%': { transform: 'scale(0.97, 1.03) rotate(-1deg)', opacity: '0.88' },
          '75%': { transform: 'scale(1.02, 1.01) rotate(0.5deg)', opacity: '0.96' },
        },
        haloPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.35' },
          '50%': { transform: 'scale(1.15)', opacity: '0.6' },
        },
        floatGlow: {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '0.6' },
          '50%': { transform: 'translateY(-6px)', opacity: '0.9' },
        }
      },
      animation: {
        flicker: 'flicker 2.8s ease-in-out infinite',
        haloPulse: 'haloPulse 4s ease-in-out infinite',
        floatGlow: 'floatGlow 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
