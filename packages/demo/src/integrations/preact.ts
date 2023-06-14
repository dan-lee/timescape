import { html, render } from 'htm/preact'
import { effect, useComputed, useSignal } from '@preact/signals'
import { useTimescape } from 'timescape/preact'

const PreactDemo = () => {
  const options = useSignal({
    date: new Date(),
  })

  const { getRootProps, getInputProps } = useTimescape(options)

  const _dateString = useComputed(() =>
    options.value.date.toLocaleString('en-UK'),
  )

  effect(() => {
    console.log('Date changed to', options.value)
  })

  return html`
    <div class="timescape-root" ...${getRootProps()}>
      <input class="timescape-input" ...${getInputProps('days')} />
      <span class="separator">/</span>
      <input class="timescape-input" ...${getInputProps('months')} />
      <span class="separator">/</span>
      <input class="timescape-input" ...${getInputProps('years')} />
      <!-- non-breaking space -->
      <span class="separator">${'\xA0'}</span>
      <input class="timescape-input" ...${getInputProps('hours')} />
      <span class="separator">:</span>
      <input class="timescape-input" ...${getInputProps('minutes')} />
      <span class="separator">:</span>
      <input class="timescape-input" ...${getInputProps('seconds')} />
    </div>
  `
}

export const renderTo = (element: HTMLElement) => {
  render(html`<${PreactDemo} />`, element)

  return () => render(null as never, element)
}
