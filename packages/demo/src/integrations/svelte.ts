import Demo from './demo.svelte'

export const renderTo = (container: HTMLElement) => {
  const app = new Demo({ target: container })

  return () => app.$destroy()
}
