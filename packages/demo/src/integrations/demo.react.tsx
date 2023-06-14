import { useState } from 'react'
import { useTimescape } from 'timescape/react'

export const ReactDemo = () => {
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
