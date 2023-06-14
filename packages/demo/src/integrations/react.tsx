import { createRoot } from 'react-dom/client'

import { useTimescape } from 'timescape/react'
import { useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
const ReactDemo = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { getRootProps, getInputProps } = useTimescape({
    date,
    onChangeDate: (nextDate) => {
      console.log('Date changed to', nextDate)
      setDate(nextDate)
    },
  })

  return (
    <div className="timescape-root" {...getRootProps()}>
      <input
        className="timescape-input"
        {...getInputProps('days')}
        placeholder="dd"
      />
      <span className="separator">/</span>
      <input
        className="timescape-input"
        {...getInputProps('months')}
        placeholder="mm"
      />
      <span className="separator">/</span>
      <input
        className="timescape-input"
        {...getInputProps('years')}
        placeholder="yyyy"
      />
      <span className="separator">&nbsp;</span>
      <input
        className="timescape-input"
        {...getInputProps('hours')}
        placeholder="hh"
      />
      <span className="separator">:</span>
      <input
        className="timescape-input"
        {...getInputProps('minutes')}
        placeholder="mm"
        step={10}
      />
      <span className="separator">:</span>
      <input
        className="timescape-input"
        {...getInputProps('seconds')}
        placeholder="mm"
      />
    </div>
  )
}

export const renderTo = (container: HTMLElement) => {
  const root = createRoot(container)
  root.render(<ReactDemo />)

  return () => requestAnimationFrame(() => root.unmount())
}
