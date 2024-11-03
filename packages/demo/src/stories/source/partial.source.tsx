import { useTimescape } from 'timescape/react'
import { root, input, separator } from '../timescape.css'

const App = () => {
  const { getRootProps, getInputProps, options } = useTimescape({
    hour12: true,
    allowPartial: true,
  })

  return (
    <div {...getRootProps()} className={root}>
      <input placeholder="yyyy" className={input} {...getInputProps('years')} />
      <span className={separator}>/</span>
      <input placeholder="mm" className={input} {...getInputProps('months')} />
      <span className={separator}>/</span>
      <input placeholder="dd" className={input} {...getInputProps('days')} />
      <input placeholder="am" className={input} {...getInputProps('am/pm')} />
    </div>
  )
}

export default App
