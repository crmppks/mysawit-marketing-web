module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: [
          'Noto Sans HK', 'sans-serif'
        ],
      }
    },
  },
  variants: {
    extend: {
      outline : ['active', 'hover']
    },
  },
  plugins: [],
}
