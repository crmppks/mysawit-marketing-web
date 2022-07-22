module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx}"
  ],
  theme: {
    extend: {
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',

        '2/9': '20%'
      }
    },
    fontFamily: {
      noto: [
        'Noto Sans HK', 'sans-serif'
      ],
    }
  },
  variants: {
    extend: {
      outline : ['active', 'hover']
    },
  },
  plugins: [],
}
