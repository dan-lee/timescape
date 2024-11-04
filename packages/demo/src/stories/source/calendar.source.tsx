import { useState } from 'react'
import { useTimescape } from 'timescape/react'
import { useDatePicker } from '@rehookify/datepicker'

import { root, input, separator } from '../timescape.css'
import { Calendar } from '../calendar'
import { SetOptions } from '../SetOptions'
import { UpdateFlasher } from '../UpdateFlasher'

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { getRootProps, getInputProps, options, update } = useTimescape({
    // Edit these options in real-time 👇
    date: new Date(),
    onChangeDate: (date) => {
      if (!date) return

      setSelectedDate(date)
      // Jumps to selected calendar month if necessary
      dpCalendar.propGetters.setOffset(date).onClick?.(undefined as never)
    },
  })

  const dpCalendar = useDatePicker({
    selectedDates: selectedDate ? [selectedDate] : [],
    onDatesChange: ([date]) => {
      update((prev) => ({ ...prev, date }))
      setSelectedDate(date)
    },
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        alignItems: 'center',
      }}
    >
      <Calendar state={dpCalendar} />

      <UpdateFlasher data={String(options.date)}>
        <div {...getRootProps()} className={root}>
          <input className={input} {...getInputProps('years')} />
          <span className={separator}>/</span>
          <input className={input} {...getInputProps('months')} />
          <span className={separator}>/</span>
          <input className={input} {...getInputProps('days')} />
        </div>
      </UpdateFlasher>
      <SetOptions
        enabled={['minDate', 'maxDate']}
        options={options}
        updateFn={update}
      />
    </div>
  )
}

export default App
