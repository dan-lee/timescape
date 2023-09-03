import { useTimescapeRange } from 'timescape/react'
import type { Meta, StoryObj } from '@storybook/react'
import { root, input, separator, invalid, flex } from './timescape.css.ts'

const RangeComponent = () => {
  const { from, to, isValid } = useTimescapeRange({
    fromDate: new Date('2021-01-01'),
    toDate: new Date('2021-12-31'),
    minDate: new Date('2021-01-01'),
    maxDate: new Date('2023-12-31'),
  })

  const rootClass = [root, isValid ? '' : invalid].join(' ')

  return (
    <div>
      <div className={rootClass}>
        <div className={flex} {...from.getRootProps()}>
          <input className={input} {...from.getInputProps('years')} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps('months')} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps('days')} />
        </div>
        <span className={separator}>&mdash;</span>
        <div className={flex} {...to.getRootProps()}>
          <input className={input} {...to.getInputProps('years')} />
          <span className={separator}>/</span>
          <input className={input} {...to.getInputProps('months')} />
          <span className={separator}>/</span>
          <input className={input} {...to.getInputProps('days')} />
        </div>
      </div>
    </div>
  )
}

type Story = StoryObj<typeof RangeComponent>

export default {
  title: 'root/range',
  tags: ['autodocs'],

  component: RangeComponent,
} satisfies Meta<typeof RangeComponent>

export const Range: Story = {
  name: 'Range',
}
