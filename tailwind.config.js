/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "menu": "100px 1fr 100px"
      },
      colors: {
        'first': '#58694B',
        'second': '#8E8925',
        'third': '#C19663',
        'fourth': '#A07055',
        'border': '#9D6F57',
        'placeholder': '#D9D9D9',
        'text': '#1D1D1B',
        primary: 'var(--color-primary)'
      },
     backgroundImage:{
      'section1': "url('../src/Assets/Images/section1.svg')",
      'section2': "url('../src/Assets/Images/section2.svg')",
      'section3': "url('../src/Assets/Images/section3.svg')",
      'presentation': "url('../src/Assets/Images/presentation.svg')",
      'object1': "url('../src/Assets/Images/object1.svg')",
      'object2': "url('../src/Assets/Images/object2.svg')",
      'object3': "url('../src/Assets/Images/object3.svg')",
      'object4': "url('../src/Assets/Images/object4.svg')",
      'object5': "url('../src/Assets/Images/codeIcon.svg')",
      'code': "url('../src/Assets/Images/code.svg')",
      'felicitation': "url('../src/Assets/Images/felicitation.svg')",
      'ticket': "url('../src/Assets/Images/ticket.svg')",
      'gift-employer': "url('../src/Assets/Images/femme.svg')",
      'gift-confeties': "url('../src/Assets/Images/confeties.svg')",
     
     },
      keyframes: {
        thetiptopLight: {
          '0%': { opacity: 0.4 },
          '25%': { opacity: 0.1 },
          '50%': { opacity: 0.4 },
          '75%': { opacity: 0.1 },
          '100%': { opacity: 0.1 },
        }
      },
      animation: {
        light: 'thetiptopLight 2s linear infinite',
      }


    },
  },
  plugins: [],
}