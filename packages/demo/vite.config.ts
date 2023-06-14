import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const getVersions = () => {
  // Execute the pnpm command and parse the output
  const output = execSync(
    'pnpm list "react" "preact" "svelte" "solid-js" "vue" --json',
    { encoding: 'utf8' },
  )
  const [pkg] = JSON.parse(output)

  return pkg.dependencies
    ? Object.entries<Record<string, string>>(pkg.dependencies).reduce(
        (defines, [name, details]) => {
          const lib = name.toUpperCase().replaceAll('-', '_')
          const placeholder = `__VERSION_${lib}__`
          defines[placeholder] = JSON.stringify(details.version)
          return defines
        },
        {},
      )
    : {}
}

export default defineConfig({
  define: getVersions(),
  build: {
    rollupOptions: {
      input: {
        app: './integrations.html',
      },
    },
  },
  // order matters for React Refresh while mixing different view libraries
  plugins: [
    svelte(),
    vue({
      include: [/\.vue$/],
      exclude: [/node_modules/, /\.tsx?$/],
    }),
    react(),
    vanillaExtractPlugin(),
  ],
  optimizeDeps: {
    include: [
      'vue',
      'react',
      'preact',
      'preact/hooks',
      '@preact/signals',
      'htm/preact',
      'svelte',
      'solid-js',
      'solid-js/web',
      'solid-js/h',
    ],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      'timescape/preact': '../lib/src/integrations/preact.ts',
      'timescape/react': '../lib/src/integrations/react.ts',
      'timescape/solid': '../lib/src/integrations/solid.ts',
      'timescape/svelte': '../lib/src/integrations/svelte.ts',
      'timescape/vue': '../lib/src/integrations/vue.ts',
      timescape: '../lib/src/index.ts',
    },
  },
})
