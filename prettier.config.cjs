/** @type {import('prettier').Options} */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',

  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '**/*.svelte',
      options: { parser: 'svelte' },
    },
  ],
}
