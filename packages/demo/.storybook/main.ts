import { type StorybookConfig } from '@storybook/react-vite'
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs'

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../dist', ...getCodeEditorStaticDirs()],
  addons: ['storybook-addon-code-editor'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
} satisfies StorybookConfig
export default config
