/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./views/**/*.{html,ejs}",
    "./src/**/*.{js,ts}"
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        xsm: '370px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        primary: '#1D4ED8', 
        secondary: '#9333EA', 
        accent: '#F59E0B', 
        buttons: '#8052EC',
        bgLight: '#BD5CF4',
        bgDark: '#9255F0'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),       // better form styling
    require('@tailwindcss/typography'),  // prose styling
    require('@tailwindcss/aspect-ratio') // aspect ratio helpers
  ],
};