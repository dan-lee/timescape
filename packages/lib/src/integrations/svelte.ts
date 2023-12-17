import {
  TimescapeManager,
  $NOW,
  type Options,
  type DateType,
  type RangeOptions,
} from '../index'
import { marry } from '../range'
import { derived, writable } from 'svelte/store'
import { onDestroy } from 'svelte'

export {
  // Svelte import names prohibit a $ prefix, so it's renamed to NOW there
  $NOW as NOW,
  type DateType,
  type Options,
  type RangeOptions,
}

export const createTimescape = (options: Options = {}) => {
  const optionsStore = writable<Options>(options)
  const { date, ...rest } = options
  const manager = new TimescapeManager(date, rest)

  manager.on('changeDate', (nextDate) => {
    optionsStore.update((value) => ({ ...value, date: nextDate }))
  })

  optionsStore.subscribe((value) => {
    manager.minDate = value.minDate
    manager.maxDate = value.maxDate
    manager.hour12 = value.hour12
    manager.digits = value.digits
    manager.wrapAround = value.wrapAround
    manager.snapToStep = value.snapToStep
  })

  derived(optionsStore, ($options) => $options.date).subscribe((value) => {
    manager.date = value
  })

  const inputProps = (element: HTMLInputElement, type: DateType) =>
    manager.registerElement(element, type)
  const rootProps = (element: HTMLElement) => manager.registerRoot(element)

  onDestroy(() => manager.remove())

  return {
    _manager: manager,
    inputProps,
    rootProps,
    options: optionsStore,
    update: optionsStore.update,
  } as const
}

export const createTimescapeRange = (options: RangeOptions = {}) => {
  const from = createTimescape(options.from)
  const to = createTimescape(options.to)

  marry(from._manager, to._manager)

  const rangeRootProps = (element: HTMLElement) => {
    from.rootProps(element)
    to.rootProps(element)
  }

  return {
    fromInputProps: from.inputProps,
    toInputProps: to.inputProps,
    from: {
      inputProps: from.inputProps,
      options: from.options,
      update: from.update,
    },
    to: {
      inputProps: to.inputProps,
      options: to.options,
      update: to.update,
    },
    rangeRootProps,
  } as const
}
