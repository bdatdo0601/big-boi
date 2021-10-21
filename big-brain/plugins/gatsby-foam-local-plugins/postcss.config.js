const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    [tailwind({ config: `${__dirname}/tailwind.config.js` })],
    autoprefixer,
  ],
};
