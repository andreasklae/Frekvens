/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff3131',
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#242424',
        },
      },
      fontFamily: {
        lastica: ['Lastica', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px #ff3131',
        'glow-md': '0 0 20px #ff3131, 0 0 40px #ff313180',
        'glow-lg': '0 0 30px #ff3131, 0 0 60px #ff313180, 0 0 90px #ff313140',
      },
      dropShadow: {
        'glow': '0 0 20px #ff3131',
        'glow-lg': '0 0 40px #ff3131',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 20px #ff3131)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 40px #ff3131) drop-shadow(0 0 60px #ff313180)',
          },
        },
      },
    },
  },
  plugins: [],
}
