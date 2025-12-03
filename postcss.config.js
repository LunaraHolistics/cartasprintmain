// NOVO E SIMPLES postcss.config.js
import tailwindcss from 'tailwindcss'

export default {
  plugins: [
    tailwindcss(),
    // @tailwindcss/postcss não é necessário se você importar o tailwindcss diretamente.
    // O PostCSS já sabe como lidar com tailwindcss()
    // Autoprefixer é geralmente injetado pelo Tailwind v4 por padrão.
  ],
}
