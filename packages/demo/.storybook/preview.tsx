import { type Parameters, type Decorator } from '@storybook/react'
import * as styles from './styles.css'
import { setupMonaco } from 'storybook-addon-code-editor'

setupMonaco({
  onMonacoLoad(monaco) {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'timescape/react' {${__TIMESCAPE_REACT_TYPES__}}`,
      'inmemory://model/timescape-react.d.ts',
    )
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module '*.css'; declare module '*';`,
      'inmemory://model/timescape.css.d.ts',
    )
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
    })
    monaco.editor.setTheme('vs-dark')
  },
})
export const parameters: Parameters = {
  options: {
    // @ts-ignore
    storySort: (a, b) => {
      if (a.type === 'docs' && b.type !== 'docs') return 1
      if (b.type === 'docs' && a.type !== 'docs') return -1
      return b.title.localeCompare(a.title)
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators: Decorator[] = [
  // (Story, ctx) =>
  //   ctx.viewMode === 'story' && ctx.kind !== 'integrations' ? (
  //     <div className={styles.background}>
  //       <Story />
  //     </div>
  //   ) : (
  //     <Story />
  //   ),
]
