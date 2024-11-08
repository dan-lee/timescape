import { type DateType } from './index'

export const isSameSeconds = (ts1: number, ts2: number) =>
  Math.floor(ts1 / 1000) === Math.floor(ts2 / 1000)

const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

export const daysInMonth = (date: Date) => {
  const month = date.getMonth()
  const year = date.getFullYear()
  return new Date(year, month + 1, 0).getDate()
}

// Hopefully this can be replaced by the Temporal API in the future
export const add = (date: Date, type: DateType, amount: number) => {
  const newDate = new Date(date)

  switch (type) {
    case 'days':
      newDate.setDate(newDate.getDate() + amount)
      break
    case 'months':
      const dayOfMonth = newDate.getDate()
      newDate.setMonth(newDate.getMonth() + amount)

      // Check if the day of the month has changed after adding the months,
      // which may happen due to different number of days in different months
      if (newDate.getDate() !== dayOfMonth) {
        newDate.setDate(0)
      }
      break
    case 'years':
      const isLeapDay = newDate.getMonth() === 1 && newDate.getDate() === 29

      newDate.setFullYear(newDate.getFullYear() + amount)

      // If original date was a leap day (Feb 29) and the year of the new date
      // isn't a leap year then adjust the new date to Feb 28
      if (isLeapDay && !isLeapYear(newDate.getFullYear())) {
        newDate.setMonth(1, 28)
      }
      break
    case 'hours':
      newDate.setHours(newDate.getHours() + amount)
      break
    case 'minutes':
      newDate.setMinutes(newDate.getMinutes() + amount)
      break
    case 'seconds':
      newDate.setSeconds(newDate.getSeconds() + amount)
      break
  }

  return newDate
}

export const set = (date: Date, type: DateType, value: number) => {
  const newDate = new Date(date)

  switch (type) {
    case 'days':
      newDate.setDate(value)
      break
    case 'months':
      // Set the day of the month to the minimum of the current day of the month
      // and the last day of the new month
      const currentDay = newDate.getDate()
      const daysInNewMonth = daysInMonth(new Date(newDate.getFullYear(), value))
      newDate.setDate(Math.min(currentDay, daysInNewMonth))
      newDate.setMonth(value)
      break
    case 'years':
      newDate.setFullYear(value)
      break
    case 'hours':
      newDate.setHours(value)
      break
    case 'minutes':
      newDate.setMinutes(value)
      break
    case 'seconds':
      newDate.setSeconds(value)
      break
    case 'am/pm':
      newDate.setHours(value)
      break
  }

  return newDate
}

export const get = (date: Date, type: DateType) => {
  switch (type) {
    case 'days':
      return date.getDate()
    case 'months':
      return date.getMonth()
    case 'years':
      return date.getFullYear()
    case 'hours':
      return date.getHours()
    case 'minutes':
      return date.getMinutes()
    case 'seconds':
      return date.getSeconds()
    case 'am/pm':
      return date.getHours()
  }
}

export const toggleAmPm = (date: Date, force?: 'am' | 'pm'): Date => {
  const hours = date.getHours()

  if (force === undefined) {
    return add(date, 'hours', hours >= 12 ? -12 : 12)
  } else if (force === 'am' && hours >= 12) {
    return add(date, 'hours', -12)
  } else if (force === 'pm' && hours < 12) {
    return add(date, 'hours', 12)
  }

  return date
}

export const format = (
  date: Date,
  type: DateType,
  hour12?: boolean,
  digits: 'numeric' | '2-digit' = '2-digit',
) => {
  const digitCount = digits === '2-digit' ? 2 : 1

  switch (type) {
    case 'years':
      const year = date.getFullYear()

      return year < 0 ? year.toString() : String(year).padStart(4, '0')

    case 'months':
      return String(date.getMonth() + 1).padStart(digitCount, '0')
    case 'days':
      return String(date.getDate()).padStart(digitCount, '0')
    case 'hours':
      const hours = hour12 ? date.getHours() % 12 || 12 : date.getHours()
      return String(hours).padStart(digitCount, '0')
    case 'minutes':
      return String(date.getMinutes()).padStart(2, '0')
    case 'seconds':
      return String(date.getSeconds()).padStart(2, '0')
    case 'am/pm':
      return date.getHours() < 12 ? 'AM' : 'PM'
  }
}
