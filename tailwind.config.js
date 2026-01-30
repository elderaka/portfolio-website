/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F4F1EA',
        graphite: '#2C2C2C',
        sand: '#EBE7DF',
        brass: '#FFB000',
        line: '#D1CDC2',
      },
    },
  },
  plugins: [],
}
