import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    react: './src/integrations/react.ts',
    preact: './src/integrations/preact.ts',
    solid: './src/integrations/solid.ts',
    svelte: './src/integrations/svelte.ts',
    vue: './src/integrations/vue.ts',
  },
  target: 'es2020',
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  external: [
    'react',
    'react-dom',
    'vue',
    'solid-js',
    'solid-js/web',
    'solid-js/store',
    'solid-js/dom',
  ],
})
