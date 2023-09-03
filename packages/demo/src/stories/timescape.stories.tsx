import { DateType } from 'timescape'
import { useTimescape } from 'timescape/react'
import type { Meta, StoryObj } from '@storybook/react'
import { root, input, separator } from './timescape.css.ts'
import { AllHTMLAttributes, useEffect } from 'react'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

import { useDateContext } from '../../.storybook/DateContext.tsx'
const TimeInputComponent = ({
  controlledDate,
  minDate,
  maxDate,
  hour12,
  digits,
  wrapAround,
  withSeconds,
  snapToStep,
  demoType,
  autofocus,
  getOtherAttributes,
}: {
  controlledDate: Date | 'unset'
  minDate: Date
  maxDate: Date
  hour12: boolean
  digits: '2-digit' | 'numeric'
  wrapAround: boolean
  withSeconds: boolean
  autofocus: DateType
  snapToStep: boolean
  demoType: 'date' | 'time' | 'datetime'
  getOtherAttributes?: (type: DateType) => AllHTMLAttributes<HTMLInputElement>
}) => {
  const [date, setDate] = useDateContext()
  useEffect(() => {
    if (controlledDate) {
      setDate(controlledDate === 'unset' ? undefined : new Date(controlledDate))
    }
  }, [controlledDate, setDate])

  const { getRootProps, getInputProps } = useTimescape({
    date,
    minDate,
    maxDate,
    hour12,
    digits,
    wrapAround,
    snapToStep,
    onChangeDate: (nextDate) => {
      setDate(nextDate)
    },
  })

  const DateInputs = (
    <>
      <input
        className={input}
        placeholder="dd"
        data-testid="days"
        {...getOtherAttributes?.('days')}
        {...getInputProps('days', { autofocus: autofocus === 'days' })}
      />
      <span className={separator}>/</span>
      <input
        className={input}
        placeholder="mm"
        data-testid="months"
        {...getOtherAttributes?.('months')}
        {...getInputProps('months', {
          autofocus: autofocus === 'months',
        })}
      />
      <span className={separator}>/</span>
      <input
        className={input}
        placeholder="yyyy"
        data-testid="years"
        {...getOtherAttributes?.('years')}
        {...getInputProps('years', {
          autofocus: autofocus === 'years',
        })}
      />
    </>
  )

  const SecondsInput = (
    <>
      <span className={separator}>:</span>
      <input
        key="seconds"
        className={input}
        placeholder="ss"
        data-testid="seconds"
        {...getOtherAttributes?.('seconds')}
        {...getInputProps('seconds', {
          autofocus: autofocus === 'seconds',
        })}
      />
    </>
  )

  const AmPmInput = (
    <input
      key="ampm"
      className={input}
      data-testid="ampm"
      {...getOtherAttributes?.('am/pm')}
      {...getInputProps('am/pm', {
        autofocus: autofocus === 'am/pm',
      })}
    />
  )

  const TimeInputs = (
    <>
      <input
        className={input}
        placeholder="hh"
        data-testid="hours"
        {...getOtherAttributes?.('hours')}
        {...getInputProps('hours', {
          autofocus: autofocus === 'hours',
        })}
      />
      <span className={separator}>:</span>
      <input
        className={input}
        placeholder="mm"
        data-testid="minutes"
        {...getOtherAttributes?.('minutes')}
        {...getInputProps('minutes', {
          autofocus: autofocus === 'minutes',
        })}
      />
      {withSeconds && SecondsInput}
      {hour12 && AmPmInput}
    </>
  )

  return (
    <div data-testid="wrapper">
      <div className={root} {...getRootProps()}>
        {(demoType === 'datetime' || demoType === 'date') && DateInputs}
        {(demoType === 'datetime' || demoType === 'time') && TimeInputs}
      </div>
    </div>
  )
}

export default {
  title: 'root/timescape',
  component: TimeInputComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    options: {
      showPanel: true,
    },
  },
  argTypes: {
    hour12: {
      name: '12-hour clock',
      description: 'Use 12-hour clock instead of 24-hour clock',
      control: 'boolean',
    },
    minDate: {
      name: 'Minimum date',
      control: 'date',
      defaultValue: undefined,
    },
    maxDate: {
      name: 'Maximum date',
      control: 'date',
      defaultValue: undefined,
    },
    wrapAround: {
      name: 'Wrap around',
      description: 'Wrap around when reaching the end of the range',
      control: 'boolean',
      defaultValue: false,
    },
    snapToStep: {
      name: 'Snap to step',
      description: 'Snap to step when scrolling',
      control: 'boolean',
      defaultValue: false,
    },
    getOtherAttributes: {
      table: {
        disable: true,
      },
    },
    digits: {
      name: 'Digits',
      description:
        'Number of digits to show, this follows <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#day" target="_blank">Intl.DateTimeFormat</a>',
      options: ['2-digit', 'numeric'],
      control: {
        type: 'select',
      },
      defaultValue: '2-digit',
    },
    withSeconds: {
      name: 'With seconds',
      description: 'Show seconds input',
      control: 'boolean',
      defaultValue: true,
    },
    controlledDate: {
      name: 'Controlled date',
      description: 'Control the date from outside',
      control: {
        type: 'date',
      },
      defaultValue: undefined,
    },
    autofocus: {
      name: 'Autofocus',
      description: 'First element that will be focused on mount',
      options: [
        '-',
        'days',
        'months',
        'years',
        'hours',
        'minutes',
        'seconds',
        'am/pm',
      ],
      control: {
        type: 'select',
      },
      defaultValue: '-',
    },
    demoType: {
      name: 'Type',
      control: {
        type: null,
      },
    },
  },
} satisfies Meta<typeof TimeInputComponent>

type Story = StoryObj<typeof TimeInputComponent>

export const DateTime: Story = {
  play: async ({ canvasElement }) => {
    const canvas = await within(canvasElement)

    const days = canvas.getByTestId<HTMLInputElement>('days')
    const months = canvas.getByTestId<HTMLInputElement>('months')

    await userEvent.click(days)

    await expect(document.activeElement).toBe(days)
    await userEvent.keyboard('{arrowup}')
    await expect(Number(days.value) === 2)

    await userEvent.keyboard('{arrowright}')
    await expect(document.activeElement).toBe(months)

    await userEvent.keyboard('{arrowdown}')
    await expect(Number(months.value) === 12)

    await userEvent.keyboard('{arrowright}')
    await userEvent.keyboard('{arrowright}')
    await userEvent.keyboard('{arrowright}')
    await userEvent.keyboard('{arrowright}')
    await expect(document.activeElement).toBe(canvas.getByTestId('seconds'))

    await userEvent.keyboard('{arrowright}')
    await expect(document.activeElement).toBe(canvas.getByTestId('days'))

    await userEvent.click(document.body)
  },
  name: 'Full date and time 24 hours',
  args: {
    demoType: 'datetime',
    withSeconds: true,
  },
}

export const DateTime2: Story = {
  name: 'Full date and time 12 hours',
  args: {
    hour12: true,
    withSeconds: true,
    demoType: 'datetime',
  },
}

export const Time1: Story = {
  name: 'Time only, 24 hours, seconds',
  args: {
    hour12: false,
    withSeconds: true,
    demoType: 'time',
  },
}

export const Time2: Story = {
  name: 'Time only, 12 hours, seconds',
  args: {
    hour12: true,
    withSeconds: false,
    demoType: 'time',
  },
}

export const Time3: Story = {
  name: 'Time only, 24 hours, no seconds',
  args: {
    hour12: false,
    withSeconds: false,
    demoType: 'time',
  },
}

export const Time4: Story = {
  name: 'Time only, 12 hours, no seconds',
  args: {
    hour12: true,
    withSeconds: false,
    demoType: 'time',
  },
}

export const DateStory: Story = {
  name: 'Date only',
  args: {
    demoType: 'date',
  },
}

export const Placeholder: Story = {
  name: 'Placeholder',
  args: {
    controlledDate: 'unset',
    withSeconds: true,
    demoType: 'datetime',
  },
}

export const Step: Story = {
  name: 'Step (15 min)',
  args: {
    demoType: 'time',
    getOtherAttributes: (type) => ({
      step: type === 'minutes' ? 12 : undefined,
    }),
  },
}

export const SnapToStep: Story = {
  name: 'Step with snapping (2hr / 15 min)',
  args: {
    snapToStep: true,
    controlledDate: new Date('2023-01-01 11:13:00'),
    demoType: 'time',
    getOtherAttributes: (type) => ({
      step: type === 'minutes' ? 15 : type === 'hours' ? 2 : undefined,
    }),
  },
}
