import { render } from 'solid-js/web'
import { createEffect, createMemo, createSignal } from 'solid-js'
import html from 'solid-js/html'

import { useTimescape } from 'timescape/solid'

const App = () => {
  const options = createSignal({
    date: new Date(),
  })

  const { getInputProps, getRootProps } = useTimescape(options)

  const date = createMemo(() => options[0]().date)

  createEffect(() => {
    console.log('Date changed to', date())
  })

  return html` <div class="timescape-root" ...${getRootProps()}>
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
  </div>`
}

export const renderTo = (container: HTMLElement) => {
  const unmount = render(App, container)

  return unmount
}
