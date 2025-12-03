// Usar module.exports é mais seguro para o PostCSS
module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer'),
  ],
};
