// Este padrão é o mais estável para ambientes de build como o Vercel.
module.exports = {
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer'),
  ],
}
