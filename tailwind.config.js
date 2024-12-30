/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this is correctly set
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '12px',
        xxxs: '10px'
      },
      colors: {
        button:{
          start:'#05ABB6',
          end:'#6BDBE2',
        },
        transparent:'rgba(255, 255, 255, 0.3)',
        highlight:'#1A1A1A',
        login:'#6FB3B8',
        cta:'#5CBE8F',
        yellow:'#F8CA55',
        outline:'#333436',
        sun:'#FF9900',
        yoi:'#B4F1CF',
        ctao:'#FF6161',
        read:'#116466',
        red:'#F85454',
        birthdaybg:'#FFECF0',
        purple:'#B8A7FB',
        viola:'#583EBC',
        pink:'#EE266E',
        active:'#3AB4BC',
        sky:'#6FA8FF',
        orange:'#EE266E',
        formbg:'#F8F8FF',
        shortcut:'#6FA8FF',
        story:{
          start:'#EE266E',
          end:'#5CBE8F',
        },
        page:'#BFC138',
        span:{
          start:'#3AB4BC',
          end:'#5CBE8F',
        },
      },
    },
  },
  plugins: [],
};
