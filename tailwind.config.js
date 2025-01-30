/** @type {import('tailwindcss').Config} */
const customColors = {
  "primary":"#3B82F6"
};
module.exports = {
  prefix: "ft-",

  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ...customColors,
      },
      width: {
        "450-px":"450px"
      },
      height: {
        "380-px":"380px"
      },
      padding: {
        "38-px":"38px"
      }
    },
  },
  corePlugins: {
    preflight: false, 
},
  plugins: [],
}

