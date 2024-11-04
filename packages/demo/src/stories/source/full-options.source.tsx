import { useTimescape } from 'timescape/react'
import { root, input, separator, wrapper } from '../timescape.css'
import { SetOptions } from '../SetOptions'

const App = () => {
  const { getRootProps, getInputProps, options, update } = useTimescape({
    date: new Date(),
    minDate: undefined,
    maxDate: undefined,
    hour12: false,
    digits: '2-digit',
    wrapAround: false,
    snapToStep: false,
    wheelControl: true,
    disallowPartial: false,
  })

  console.log(options.date)

  return (
    <div className={wrapper}>
      <div {...getRootProps()} className={root}>
        <input className={input} {...getInputProps('years')} />
        <span className={separator}>/</span>
        <input className={input} {...getInputProps('months')} />
        <span className={separator}>/</span>
        <input className={input} {...getInputProps('days')} />
        <span className={separator}>⋆</span>
        <input className={input} {...getInputProps('hours')} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps('minutes')} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps('seconds')} />
        {options.hour12 && (
          <input className={input} {...getInputProps('am/pm')} />
        )}
      </div>
      <SetOptions options={options} updateFn={update} />
    </div>
  )
}

export default App
