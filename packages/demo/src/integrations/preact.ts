import { html, render } from 'htm/preact'
import { useComputed, useSignal, useSignalEffect } from '@preact/signals'
import { useTimescape, useTimescapeRange } from 'timescape/preact'

const PreactDemo = () => {
  const options = useSignal({
    date: new Date(),
  })

  const { getRootProps, getInputProps } = useTimescape(options)

  const otherOptions = useSignal({
    fromDate: new Date(),
    toDate: new Date(),
  })

  const { from, to, isValid } = useTimescapeRange(otherOptions)

  const _dateString = useComputed(() =>
    options.value.date.toLocaleString('en-UK'),
  )

  useSignalEffect(() => {
    console.log('Date changed to', options.value)
  })

  return html`
    <div>
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

      <div>
        <div ...${from.getRootProps()}>
          <input class="timescape-input" ...${from.getInputProps('years')} />
          <input class="timescape-input" ...${from.getInputProps('months')} />
          <input class="timescape-input" ...${from.getInputProps('days')} />
        </div>
        <div ...${to.getRootProps()}>
          <input class="timescape-input" ...${to.getInputProps('years')} />
          <input class="timescape-input" ...${to.getInputProps('months')} />
          <input class="timescape-input" ...${to.getInputProps('days')} />
        </div>
      </div>
    </div>
  `
}

export const renderTo = (element: HTMLElement) => {
  render(html`<${PreactDemo} />`, element)

  return () => render(null as never, element)
}
