/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        paper: '#FFFDF7',
        ink: '#1A1A1A',
        primary: {
          DEFAULT: '#2B4C7E',
          light: '#5B7DB1',
          dark: '#1E3558',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#A67C3B',
        },
        sage: '#E8EDE5',
        muted: '#6B7280',
      },
      fontFamily: {
        serif: ['Georgia', 'SourceSerif', 'serif'],
        sans: ['Inter', 'System', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
