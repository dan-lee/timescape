import { daysInMonth, isSameSeconds, add, set, get, format } from '../src/date'
import { describe, test, expect } from 'vitest'

describe('date helper', () => {
  test('set days', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'days', 15)
    expect(newDate.toISOString()).toEqual('2021-12-15T21:59:59.000Z')
  })

  test('set months', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'months', 1)
    expect(newDate.toISOString()).toEqual('2021-02-28T21:59:59.000Z')
  })

  test('set years', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'years', 2020)
    expect(newDate.toISOString()).toEqual('2020-12-31T21:59:59.000Z')
  })

  test('set hours', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'hours', 15)
    expect(newDate.toISOString()).toEqual('2021-12-31T15:59:59.000Z')
  })

  test('set minutes', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'minutes', 30)
    expect(newDate.toISOString()).toEqual('2021-12-31T21:30:59.000Z')
  })

  test('set seconds', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'seconds', 30)
    expect(newDate.toISOString()).toEqual('2021-12-31T21:59:30.000Z')
  })

  test('set AM/PM', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = set(date, 'am/pm', 9)
    expect(newDate.toISOString()).toEqual('2021-12-31T09:59:59.000Z')
  })

  test('isSameSeconds', () => {
    const ts1 = Date.UTC(2022, 0, 1, 0, 0, 0, 500)
    const ts2 = Date.UTC(2022, 0, 1, 0, 0, 0, 800)
    expect(isSameSeconds(ts1, ts2)).toBeTruthy()

    const ts3 = Date.UTC(2022, 0, 1, 0, 0, 0, 500)
    const ts4 = Date.UTC(2022, 0, 1, 0, 0, 1, 200)
    expect(isSameSeconds(ts3, ts4)).toBeFalsy()
  })

  test('daysInMonth', () => {
    const date1 = new Date(2021, 0) // January
    expect(daysInMonth(date1)).toEqual(31)

    const date2 = new Date(2021, 1) // February
    expect(daysInMonth(date2)).toEqual(28)

    const date3 = new Date(2020, 1) // February in a leap year
    expect(daysInMonth(date3)).toEqual(29)

    const date4 = new Date(2021, 3) // April
    expect(daysInMonth(date4)).toEqual(30)
  })

  test('add days', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = add(date, 'days', 2)
    expect(newDate.toISOString()).toEqual('2022-01-02T21:59:59.000Z')
  })

  test('add months', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = add(date, 'months', 2)
    expect(newDate.toISOString()).toEqual('2022-02-28T21:59:59.000Z')
  })

  test('add years', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = add(date, 'years', 2)
    expect(newDate.toISOString()).toEqual('2023-12-31T21:59:59.000Z')
  })

  test('add hours', () => {
    const date = new Date('2021-12-31T22:59:59.000Z')
    const newDate = add(date, 'hours', 2)
    expect(newDate.toISOString()).toEqual('2022-01-01T00:59:59.000Z')
  })

  test('add minutes', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = add(date, 'minutes', 2)
    expect(newDate.toISOString()).toEqual('2021-12-31T22:01:59.000Z')
  })

  test('add seconds', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    const newDate = add(date, 'seconds', 2)
    expect(newDate.toISOString()).toEqual('2021-12-31T22:00:01.000Z')
  })

  test('subtract days at month start', () => {
    const date = new Date('2021-03-01T00:00:00.000Z')
    const newDate = add(date, 'days', -1)
    expect(newDate.toISOString()).toEqual('2021-02-28T00:00:00.000Z')
  })

  test('subtract months at year start', () => {
    const date = new Date('2021-01-15T00:00:00.000Z')
    const newDate = add(date, 'months', -1)
    expect(newDate.toISOString()).toEqual('2020-12-15T00:00:00.000Z')
  })

  test('subtract days across leap year', () => {
    const date = new Date('2020-03-01T00:00:00.000Z')
    const newDate = add(date, 'days', -1)
    expect(newDate.toISOString()).toEqual('2020-02-29T00:00:00.000Z')
  })

  test('subtract years on leap year', () => {
    const date = new Date('2024-02-29T00:00:00.000Z')
    const newDate = add(date, 'years', -1)
    expect(newDate.toISOString()).toEqual('2023-02-28T00:00:00.000Z')
  })

  test('subtract years on non-leap year', () => {
    const date = new Date('2023-02-28T00:00:00.000Z')
    const newDate = add(date, 'years', -1)
    expect(newDate.toISOString()).toEqual('2022-02-28T00:00:00.000Z')
  })

  test('get', () => {
    const date = new Date('2021-12-31T21:59:59.000Z')
    expect(get(date, 'days')).toEqual(31)
    expect(get(date, 'months')).toEqual(11)
    expect(get(date, 'years')).toEqual(2021)
    expect(get(date, 'hours')).toEqual(21)
    expect(get(date, 'minutes')).toEqual(59)
    expect(get(date, 'seconds')).toEqual(59)
    expect(get(date, 'am/pm')).toEqual(21)
  })

  test('format', () => {
    let date = new Date('2021-09-01T09:09:09.000Z')

    expect([
      format(date, 'years'),
      format(date, 'months'),
      format(date, 'days'),
      format(date, 'hours'),
      format(date, 'minutes'),
      format(date, 'seconds'),
      format(date, 'am/pm'),
    ]).toEqual(['2021', '09', '01', '09', '09', '09', 'AM'])

    expect([
      format(date, 'years', undefined, 'numeric'),
      format(date, 'months', undefined, 'numeric'),
      format(date, 'days', undefined, 'numeric'),
      format(date, 'hours', undefined, 'numeric'),
      format(date, 'minutes', undefined, 'numeric'),
      format(date, 'seconds', undefined, 'numeric'),
      format(date, 'am/pm', undefined, 'numeric'),
    ]).toEqual(['2021', '9', '1', '9', '09', '09', 'AM'])

    expect([format(date, 'hours', true), format(date, 'am/pm', true)]).toEqual([
      '09',
      'AM',
    ])

    date = new Date('2021-09-01T00:09:09.000Z')

    expect([format(date, 'hours', true), format(date, 'am/pm', true)]).toEqual([
      '12',
      'AM',
    ])

    date = new Date('2021-09-01T23:09:09.000Z')

    expect([format(date, 'hours', true), format(date, 'am/pm', true)]).toEqual([
      '11',
      'PM',
    ])
  })
})
