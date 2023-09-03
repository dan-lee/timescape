import { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'

import * as styles from './integrations.css'
import ReactLogo from './logos/ReactLogo'
import PreactLogo from './logos/PreactLogo'
import SolidLogo from './logos/SolidLogo'
import SvelteLogo from './logos/SvelteLogo'
import VueLogo from './logos/VueLogo'

type Integration = 'react' | 'preact' | 'solid' | 'svelte' | 'vue'
const Badge = ({ integration }: { integration: Integration }) => {
  switch (integration) {
    case 'react':
      return (
        <div className={styles.badge}>
          <ReactLogo style={{ height: 20, color: 'rgb(20, 158, 202)' }} />
          <span>React</span>
          <span className={styles.badgeVersion}>v{__VERSION_REACT__}</span>
        </div>
      )
    case 'preact':
      return (
        <div className={styles.badge}>
          <PreactLogo style={{ height: 20, width: 'auto' }} />
          <span>Preact</span>
          <span className={styles.badgeVersion}>v{__VERSION_PREACT__}</span>
        </div>
      )
    case 'solid':
      return (
        <div className={styles.badge}>
          <SolidLogo style={{ height: 20, width: 'auto' }} />
          <span>Solid.js</span>
          <span className={styles.badgeVersion}>v{__VERSION_SOLID_JS__}</span>
        </div>
      )
    case 'svelte':
      return (
        <div className={styles.badge}>
          <SvelteLogo style={{ height: 20, width: 'auto' }} />
          <span>Svelte</span>
          <span className={styles.badgeVersion}>v{__VERSION_SVELTE__}</span>
        </div>
      )
    case 'vue':
      return (
        <div className={styles.badge}>
          <VueLogo style={{ height: 16, width: 'auto' }} />
          <span>Vue</span>
          <span className={styles.badgeVersion}>v{__VERSION_VUE__}</span>
        </div>
      )
  }
}

const IframeComponent = ({ integration }: { integration: Integration }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const src = import.meta.env.DEV
    ? `http://localhost:5173/integrations.html?value=${integration}`
    : `./integrations.html?value=${integration}`

  return (
    <div>
      <iframe
        title={`${integration} integration demo`}
        role="presentation"
        src={src}
        className={styles.iframe}
      />
      <Badge integration={integration} />
      <div
        className={styles.info}
        data-text="The integration examples are rendered in an iframe and don't provide option controls. Check out the timescape stories for all the configurable options."
      >
        ?
      </div>
    </div>
  )
}

export default {
  title: 'root/integrations',
  component: IframeComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    integration: {
      options: ['react', 'preact', 'solid', 'svelte', 'vue'],
      table: { disable: true },
    },
  },
} satisfies Meta<typeof IframeComponent>

type Story = StoryObj<typeof IframeComponent>

export const React: Story = { args: { integration: 'react' } }
export const Preact: Story = { args: { integration: 'preact' } }
export const Solid: Story = { args: { integration: 'solid' } }
export const Svelte: Story = { args: { integration: 'svelte' } }
export const Vue: Story = { args: { integration: 'vue' } }
