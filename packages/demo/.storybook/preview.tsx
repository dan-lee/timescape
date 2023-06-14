import { type Parameters, type Decorator } from '@storybook/react'
import { DateContextProvider } from './DateContext'

import * as styles from './styles.css'
import { useEffect } from 'react'

export const parameters: Parameters = {
  options: {
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
  (Story, ctx) =>
    ctx.viewMode === 'story' && ctx.kind !== 'integrations' ? (
      <div className={styles.background}>
        <Story />
      </div>
    ) : (
      <Story />
    ),
  (Story, ctx) => (
    <DateContextProvider
      showBottomToolbar={
        ctx.viewMode !== 'docs' && !ctx.kind.includes('integrations')
      }
    >
      <Story />
    </DateContextProvider>
  ),
]
