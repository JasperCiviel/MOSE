import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        lagoon: {
          50: '#f1f8ff',
          100: '#d9ecff',
          200: '#b0d7ff',
          300: '#81beff',
          400: '#4a9dff',
          500: '#1f7dff',
          600: '#0f60db',
          700: '#0e4cb1',
          800: '#123e89',
          900: '#12366f'
        }
      },
      boxShadow: {
        soft: '0 20px 40px -20px rgba(15, 96, 219, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
