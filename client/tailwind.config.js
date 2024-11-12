/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/AuthForm.tsx",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/field/Field.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd",
          "400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8",
          "800":"#1e40af","900":"#1e3a8a","950":"#172554"
        }
      },
      padding:{
        layout:'1.25rem'
      },
      transitionDuration:{
        DEFAULT:'444ms'
      },
      transitionTimingFunction:{
        DEFAULT:'ease-linear'
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};