import { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { createLiveEditStory } from 'storybook-addon-code-editor'

import * as styles from './integrations.css'
import ReactLogo from './logos/ReactLogo'
import PreactLogo from './logos/PreactLogo'
import SolidLogo from './logos/SolidLogo'
import SvelteLogo from './logos/SvelteLogo'
import VueLogo from './logos/VueLogo'
import JsLogo from './logos/JsLogo.tsx'

type Integration = 'react' | 'preact' | 'solid' | 'svelte' | 'vue' | 'vanilla'
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
    case 'vanilla':
      return (
        <div className={styles.badge}>
          <span>Vanilla</span>
          <JsLogo style={{ height: 18, width: 'auto' }} />
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
    ? `http://localhost:4949/integrations.html?value=${integration}`
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
        data-text="The integration examples are rendered in an iframe with their respective framework and therefore doesn't provide live code edit. Check out the timescape stories where this is possible."
      >
        ?
      </div>
    </div>
  )
}

export default {
  title: 'root/integrations',
  component: () => null,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export const React: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/demo.react.tsx?raw').then(
      (m) => m.default,
    ),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="react" />,
}

export const Preact: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/preact.ts?raw').then((m) => m.default),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="preact" />,
}

export const Solid: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/solid.ts?raw').then((m) => m.default),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="solid" />,
}

export const Svelte: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/demo.svelte?raw').then(
      (m) => m.default,
    ),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="svelte" />,
}

export const Vue: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/demo.vue?raw').then((m) => m.default),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="vue" />,
}

export const Vanilla: StoryObj = {
  ...createLiveEditStory({
    code: await import('../integrations/vanilla.ts?raw').then((m) => m.default),
    modifyEditor: ({ editor }) => {
      editor.getEditors().at(0)?.updateOptions({ readOnly: true })
    },
  }),
  render: () => <IframeComponent integration="vanilla" />,
}
