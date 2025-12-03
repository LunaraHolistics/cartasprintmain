// NOVO E CORRETO postcss.config.js (Sintaxe ES Module)

import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    // Chamamos a função importada do pacote
    tailwindcss,
    autoprefixer,
  ],
};
