import {
  fireEvent,
  getByTestId,
  queryByTestId,
  waitFor,
} from '@testing-library/dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { PropertySymbol } from 'happy-dom'

import { TimescapeManager, DateType } from '../src'

const register = (manager: TimescapeManager, fields: DateType[]) => {
  const container = document.createElement('div')
  container.innerHTML = `
    <div data-testid="root" class="root">${fields
      .map((field) => `<input data-testid="${field}" />`)
      .join('')}</div>
  `

  manager.registerRoot(getByTestId(container, 'root'))
  fields.forEach((type) => {
    manager.registerElement(getByTestId(container, type), type)
  })

  return container
}

const baseDate = new Date('2021-12-31T23:59:59Z')
let manager: TimescapeManager
let container: HTMLDivElement
beforeEach(() => {
  document.body.innerHTML = ''
  manager = new TimescapeManager(baseDate)

  // yyyy-mm-dd hh:mm:ss am/pm
  container = register(manager, [
    'years',
    'months',
    'days',
    'hours',
    'minutes',
    'seconds',
    'am/pm',
  ] satisfies DateType[])
})

const getFields = () => {
  const root = queryByTestId<HTMLDivElement>(container, 'root')!
  const years = queryByTestId<HTMLInputElement>(root, 'years')!
  const months = queryByTestId<HTMLInputElement>(root, 'months')!
  const days = queryByTestId<HTMLInputElement>(root, 'days')!
  const hours = queryByTestId<HTMLInputElement>(root, 'hours')!
  const minutes = queryByTestId<HTMLInputElement>(root, 'minutes')!
  const seconds = queryByTestId<HTMLInputElement>(root, 'seconds')!
  const ampm = queryByTestId<HTMLInputElement>(root, 'am/pm')!

  return { root, years, months, days, hours, minutes, seconds, ampm }
}

describe('timescape', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      document.body.appendChild(container)

      const fields = getFields()

      expect(fields.years).toHaveValue('2021')
      expect(fields.months).toHaveValue('12')
      expect(fields.days).toHaveValue('31')
      expect(fields.hours).toHaveValue('23')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.seconds).toHaveValue('59')
      expect(fields.ampm).toHaveValue('PM')
    })

    it('should render correctly with hour12', () => {
      document.body.appendChild(container)

      manager.hour12 = true
      const fields = getFields()

      expect(fields.years).toHaveValue('2021')
      expect(fields.months).toHaveValue('12')
      expect(fields.days).toHaveValue('31')
      expect(fields.hours).toHaveValue('11')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.seconds).toHaveValue('59')
      expect(fields.ampm).toHaveValue('PM')
    })

    it('should render correctly with digits', () => {
      document.body.appendChild(container)

      manager.digits = 'numeric'
      manager.date = new Date('2021-01-01T01:01:01Z')

      const fields = getFields()

      expect(fields.years).toHaveValue('2021')
      expect(fields.months).toHaveValue('1')
      expect(fields.days).toHaveValue('1')
      expect(fields.hours).toHaveValue('1')
      expect(fields.minutes).toHaveValue('01')
      expect(fields.seconds).toHaveValue('01')
      expect(fields.ampm).toHaveValue('AM')
    })

    it('update when date changes', () => {
      document.body.appendChild(container)

      manager.date = new Date('2021-01-21 11:01:21')
      const fields = getFields()

      expect(fields.years).toHaveValue('2021')
      expect(fields.months).toHaveValue('01')
      expect(fields.days).toHaveValue('21')
      expect(fields.hours).toHaveValue('11')
      expect(fields.minutes).toHaveValue('01')
      expect(fields.seconds).toHaveValue('21')
      expect(fields.ampm).toHaveValue('AM')
    })

    it('should render correctly when date is undefined', () => {
      document.body.appendChild(container)

      manager.date = undefined
      const fields = getFields()

      expect(fields.years).toHaveValue('')
      expect(fields.months).toHaveValue('')
      expect(fields.days).toHaveValue('')
      expect(fields.hours).toHaveValue('')
      expect(fields.minutes).toHaveValue('')
      expect(fields.seconds).toHaveValue('')
      expect(fields.ampm).toHaveValue('')
    })

    it('should focus on click', () => {
      document.body.appendChild(container)

      const { years } = getFields()
      fireEvent.click(years)

      expect(years).toHaveFocus()
    })

    it('should support autofocus', async () => {
      const container = document.createElement('div')
      container.innerHTML = `
      <div data-testid="root">
        <input data-testid="years" />
      </div>
      `

      const manager = new TimescapeManager()

      manager.registerRoot(getByTestId(container, 'root'))
      manager.registerElement(getByTestId(container, 'years'), 'years', true)

      document.body.appendChild(container)

      // will only be selected after the next frame
      await waitFor(() => {
        expect(getByTestId(container, 'years')).toHaveFocus()
      })
    })

    it('should render placeholders correctly', async () => {
      container = document.createElement('div')
      manager = new TimescapeManager()
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="years" placeholder="YYYY" />
        </div>
      `
      document.body.appendChild(container)

      const { years } = getFields()

      manager.date = undefined
      manager.registerRoot(container)
      manager.registerElement(years, 'years')

      expect(years).toHaveValue('')
      expect(years).toHaveAttribute('placeholder', 'YYYY')
    })

    it('should cleanup correctly', () => {
      document.body.appendChild(container)

      const fields = getFields()

      Object.values(fields).forEach((field) => {
        // @ts-expect-error not public API
        const listeners = field[PropertySymbol.listeners]
        return Object.values(listeners).forEach((l) => {
          expect(l).not.toHaveLength(0)
        })
      })

      manager.remove()

      Object.values(fields).forEach((field) => {
        // @ts-expect-error not public API
        const listeners = field[PropertySymbol.listeners]
        return Object.values(listeners).forEach((l) => {
          expect(l).toHaveLength(0)
        })
      })
    })
  })

  describe('keyboard navigation', () => {
    it('should focus first element by root', () => {
      document.body.appendChild(container)

      const { root, years } = getFields()

      root.focus()
      expect(years).toHaveFocus()
    })

    it('should focus the second element by the Tab key', () => {
      document.body.appendChild(container)
      const { years, months } = getFields()

      years.focus()
      expect(years).toHaveFocus()

      fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
      expect(months).toHaveFocus()
    })

    it('should cycle through fields by Enter key', () => {
      document.body.appendChild(container)
      const { years, months, days, hours, minutes, seconds, ampm } = getFields()

      years.focus()
      expect(years).toHaveFocus()

      const elements = [
        months,
        days,
        hours,
        minutes,
        seconds,
        ampm,
        // start from beginning
        years,
      ]
      for (const element of elements) {
        fireEvent.keyDown(document.activeElement!, { key: 'Enter' })
        expect(element).toHaveFocus()
      }
    })

    it('should cycle through fields by arrow keys', () => {
      document.body.appendChild(container)
      const { years, months, days, hours, minutes, seconds, ampm } = getFields()

      years.focus()
      expect(years).toHaveFocus()

      const elements = [
        months,
        days,
        hours,
        minutes,
        seconds,
        ampm,
        // start from beginning
        years,
      ]
      for (const element of elements) {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
        expect(element).toHaveFocus()
      }
    })

    it('should cycle through fields by arrow keys in reverse', () => {
      document.body.appendChild(container)
      const { years, months, days, hours, minutes, seconds, ampm } = getFields()

      ampm.focus()
      expect(ampm).toHaveFocus()

      const orderedElements = [
        seconds,
        minutes,
        hours,
        days,
        months,
        years,
        // start from end
        ampm,
      ]
      for (const element of orderedElements) {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
        expect(element).toHaveFocus()
      }
    })

    it('should change values with up/down arrow keys', () => {
      document.body.appendChild(container)
      const fields = getFields()

      // years
      fields.years.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })

      expect(fields.years).toHaveValue('2022')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 31 Dec 2022 23:59:59 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.years.value).toMatchInlineSnapshot('"2021"')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )

      // months
      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.months).toHaveValue('01')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Mon, 31 Jan 2022 23:59:59 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.months).toHaveValue('12')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )

      // days
      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.days).toHaveValue('01')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 23:59:59 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.days).toHaveValue('31')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )

      // hours
      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.hours).toHaveValue('00')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:59:59 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.hours).toHaveValue('23')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )

      // minutes
      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.minutes).toHaveValue('00')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:00:59 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.minutes).toHaveValue('59')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )

      // seconds
      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('00')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:00:00 GMT"',
      )

      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.seconds).toHaveValue('59')
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      )
    })

    it('should change values with up/down arrow keys in 12-hour mode', () => {
      document.body.appendChild(container)
      manager.hour12 = true

      const fields = getFields()

      expect(fields.ampm).toHaveValue('PM')

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.hours).toHaveValue('12')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.seconds).toHaveValue('00')
      expect(fields.ampm).toHaveValue('AM')
    })

    it('should change 12-hour mode period value with `p`/`a` keys', () => {
      document.body.appendChild(container)
      manager.hour12 = true

      const fields = getFields()

      expect(fields.ampm).toHaveValue('PM')

      fields.ampm.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'a' })
      expect(fields.ampm).toHaveValue('AM')

      fireEvent.keyDown(document.activeElement!, { key: 'p' })
      expect(fields.ampm).toHaveValue('PM')

      fireEvent.keyDown(document.activeElement!, { key: 'A' })
      expect(fields.ampm).toHaveValue('AM')

      fireEvent.keyDown(document.activeElement!, { key: 'P' })
      expect(fields.ampm).toHaveValue('PM')
    })
  })

  describe('steps', () => {
    it('should take step into account', () => {
      container = document.createElement('div')
      manager = new TimescapeManager()
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="minutes" step="15" />
        </div>
      `
      document.body.appendChild(container)

      const { minutes } = getFields()

      manager.date = new Date('2021-01-01 01:13:43')
      manager.registerRoot(container)
      manager.registerElement(minutes, 'minutes')

      minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(minutes).toHaveValue('28')
    })

    it('should work with snapToStep', () => {
      container = document.createElement('div')
      manager = new TimescapeManager()
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="hours" step="3" />
          <input data-testid="minutes" step="15" />
          <input data-testid="seconds" step="30" />
        </div>
      `
      document.body.appendChild(container)

      const { hours, minutes, seconds } = getFields()

      manager.snapToStep = true
      manager.date = new Date('2021-01-01 01:13:43')
      manager.registerRoot(container)
      manager.registerElement(hours, 'hours')
      manager.registerElement(minutes, 'minutes')
      manager.registerElement(seconds, 'seconds')

      const fields = getFields()

      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.hours).toHaveValue('00')
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.hours).toHaveValue('21')

      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.minutes).toHaveValue('15')
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.minutes).toHaveValue('30')

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('00')
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('30')
    })
  })

  describe('min and max date', () => {
    it('should not allow dates before minDate', () => {
      document.body.appendChild(container)
      manager.date = new Date('2021-06-06T00:00:00.000Z')
      manager.minDate = new Date('2021-06-06T00:00:00.000Z')

      const fields = getFields()

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.seconds).toHaveValue('00')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.hours).toHaveValue('00')
      expect(fields.days).toHaveValue('06')
      expect(fields.months).toHaveValue('06')
      expect(fields.years).toHaveValue('2021')

      // type in a value
      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: '0' })
      fireEvent.keyDown(document.activeElement!, { key: '5' })
      expect(fields.days).toHaveFocus()

      expect(fields.seconds).toHaveValue('00')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.hours).toHaveValue('00')
      expect(fields.days).toHaveValue('06')
      expect(fields.months).toHaveValue('06')
      expect(fields.years).toHaveValue('2021')
    })

    it('should not allow dates after maxDate', () => {
      document.body.appendChild(container)
      manager.date = new Date('2021-06-06T00:00:00.000Z')
      manager.maxDate = new Date('2021-06-06T00:00:00.000Z')

      const fields = getFields()

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('00')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.hours).toHaveValue('00')
      expect(fields.days).toHaveValue('06')
      expect(fields.months).toHaveValue('06')
      expect(fields.years).toHaveValue('2021')

      // type in a value
      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      fireEvent.keyDown(document.activeElement!, { key: '0' })
      expect(fields.days).toHaveFocus()

      expect(fields.seconds).toHaveValue('00')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.hours).toHaveValue('00')
      expect(fields.days).toHaveValue('06')
      expect(fields.months).toHaveValue('06')
      expect(fields.years).toHaveValue('2021')
    })
  })

  describe('wrap around option', () => {
    it('should wrap around seconds', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('00')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.hours).toHaveValue('23')
      expect(fields.days).toHaveValue('31')
      expect(fields.months).toHaveValue('12')
      expect(fields.years).toHaveValue('2021')
    })

    it('should wrap around minutes', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('59')
      expect(fields.minutes).toHaveValue('00')
      expect(fields.hours).toHaveValue('23')
      expect(fields.days).toHaveValue('31')
      expect(fields.months).toHaveValue('12')
      expect(fields.years).toHaveValue('2021')
    })

    it('should wrap around hours', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('59')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.hours).toHaveValue('00')
      expect(fields.days).toHaveValue('31')
      expect(fields.months).toHaveValue('12')
      expect(fields.years).toHaveValue('2021')
    })

    it('should wrap around days', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('59')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.hours).toHaveValue('23')
      expect(fields.days).toHaveValue('01')
      expect(fields.months).toHaveValue('12')
      expect(fields.years).toHaveValue('2021')
    })

    it('should wrap around months', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('59')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.hours).toHaveValue('23')
      expect(fields.days).toHaveValue('31')
      expect(fields.months).toHaveValue('01')
      expect(fields.years).toHaveValue('2021')
    })

    it('should wrap correctly with 12-hour mode', () => {
      document.body.appendChild(container)
      manager.wrapAround = true
      manager.hour12 = true

      const fields = getFields()

      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.seconds).toHaveValue('59')
      expect(fields.minutes).toHaveValue('59')
      expect(fields.hours).toHaveValue('12')
      expect(fields.days).toHaveValue('31')
      expect(fields.months).toHaveValue('12')
      expect(fields.years).toHaveValue('2021')
      expect(fields.ampm).toHaveValue('AM')
    })

    it('should do nothing for years and ampm', () => {
      document.body.appendChild(container)
      manager.wrapAround = true

      const fields = getFields()

      fields.years.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.years).toHaveValue('2022')

      fields.ampm.focus()
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.ampm).toHaveValue('AM')
    })
  })

  describe('manual typing', () => {
    it('should work with seconds', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.seconds).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.seconds).toHaveValue('19')

      // when value entered bigger than '5', it will focus next field
      fields.seconds.focus()
      fireEvent.keyDown(document.activeElement!, { key: '7' })
      expect(fields.seconds).toHaveValue('07')
      expect(fields.ampm).toHaveFocus()
    })

    it('should work with minutes', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.minutes).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.minutes).toHaveValue('19')

      // when value entered bigger than '5', it will focus next field
      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: '7' })
      expect(fields.minutes).toHaveValue('07')
      expect(fields.seconds).toHaveFocus()
    })

    it('should work with hours', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.hours).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.hours).toHaveValue('19')

      // when value entered bigger than '2', it will focus next field
      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: '3' })
      expect(fields.hours).toHaveValue('03')
      expect(fields.minutes).toHaveFocus()
    })

    it('should work with manual typing in 12-hour mode', () => {
      document.body.appendChild(container)
      manager.hour12 = true

      const fields = getFields()

      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.hours).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.hours).toHaveValue('09')

      // when value 12 entered, it should change AM/PM
      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.hours).toHaveValue('12')
      expect(fields.ampm).toHaveValue('PM')

      // when value entered bigger than '1', it will focus next field
      fields.hours.focus()
      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.hours).toHaveValue('02')
      expect(fields.minutes).toHaveFocus()
    })

    it('should work with days', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.days).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.days).toHaveValue('19')

      // when value entered bigger than '3', it will focus next field
      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: '4' })
      expect(fields.days).toHaveValue('04')
      expect(fields.hours).toHaveFocus()
    })

    it('should work with days and take max days in month into account', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: '3' })
      expect(fields.days).toHaveValue('03')

      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.days).toHaveValue('31')

      manager.date = new Date(2021, 1, 1)
      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.days).toHaveValue('02')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.days).toHaveValue('28')
    })

    it('should work with months', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      expect(fields.months).toHaveValue('01')

      fireEvent.keyDown(document.activeElement!, { key: '9' })
      expect(fields.months).toHaveValue('12')

      // when value entered bigger than '1', it will focus next field
      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.months).toHaveValue('02')
      expect(fields.days).toHaveFocus()
    })

    it('should work with years', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.years.focus()
      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.years).toHaveValue('0002')

      fireEvent.keyDown(document.activeElement!, { key: '0' })
      expect(fields.years).toHaveValue('0020')

      fireEvent.keyDown(document.activeElement!, { key: '2' })
      expect(fields.years).toHaveValue('0202')

      fireEvent.keyDown(document.activeElement!, { key: '0' })
      expect(fields.years).toHaveValue('2020')

      expect(fields.months).toHaveFocus()
    })

    it('should work with single digits', () => {
      document.body.appendChild(container)

      manager.digits = 'numeric'
      const fields = getFields()

      fields.days.focus()
      fireEvent.keyDown(document.activeElement!, { key: '9' })
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
      expect(fields.days).toHaveValue('9')
    })

    it('should allow up/down keys when there is an intermediate value', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: '3' })
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
      expect(fields.minutes).toHaveValue('04')

      fields.months.focus()
      fireEvent.keyDown(document.activeElement!, { key: '1' })
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      expect(fields.months).toHaveValue('12')
    })

    it('should set value to intermediate value when focus is lost', () => {
      document.body.appendChild(container)

      const fields = getFields()

      fields.minutes.focus()
      fireEvent.keyDown(document.activeElement!, { key: '3' })
      fields.hours.focus()
      expect(fields.minutes).toHaveValue('03')
    })
  })

  it('should support setting options on constructor', () => {
    const container = document.createElement('div')
    new TimescapeManager(baseDate, {
      digits: 'numeric',
      hour12: true,
      wrapAround: true,
      maxDate: new Date(2024, 0, 1),
      minDate: new Date(2020, 0, 1),
    })

    document.body.appendChild(container)
  })

  it('should not focus initial field when root is clicked while other field is focused', async () => {
    document.body.appendChild(container)

    const { root, years, months } = getFields()

    // root needs focus event to be triggered
    fireEvent.focus(root)

    expect(years).toHaveFocus()

    fireEvent.click(months)
    expect(months).toHaveFocus()

    fireEvent.focus(root)
    expect(months).toHaveFocus()
  })
})
