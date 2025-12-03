import tailwindcss from 'tailwindcss';

export default {
  plugins: [
    tailwindcss(), // Importa e executa o plugin do Tailwind
    // O @tailwindcss/postcss não é necessário quando se importa a biblioteca diretamente
    // e executa a função como plugin.
    require('autoprefixer'),
  ],
};
