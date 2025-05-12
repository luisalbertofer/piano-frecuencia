/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    safelist: [
    'bg-gray-300',
    'bg-yellow-300',
    'bg-orange-300',
    'bg-sky-300',
    'bg-green-300',
    'bg-purple-300',
    'bg-orange-400',
    'bg-pink-400'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
