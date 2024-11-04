import { useTimescape } from 'timescape/react'
import { root, input, separator } from '../timescape.css'

const App = () => {
  const { getRootProps, getInputProps, options } = useTimescape({
    hour12: true,
  })

  return (
    <div>
      <div {...getRootProps()} className={root}>
        <input
          placeholder="yyyy"
          className={input}
          {...getInputProps('years')}
        />
        <span className={separator}>/</span>
        <input
          placeholder="mm"
          className={input}
          {...getInputProps('months')}
        />
        <span className={separator}>/</span>
        <input placeholder="dd" className={input} {...getInputProps('days')} />
        <span className={separator}>&nbsp;</span>
        <input placeholder="--" className={input} {...getInputProps('hours')} />
        <span className={separator}>:</span>
        <input
          placeholder="--"
          className={input}
          {...getInputProps('minutes')}
        />
        <span className={separator}>&nbsp;</span>
        <input placeholder="am" className={input} {...getInputProps('am/pm')} />
      </div>
      <pre>Output: {options.date?.toISOString() ?? '-'}</pre>
    </div>
  )
}

export default App
