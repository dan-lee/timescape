import { TimescapeManager, $NOW, type Options, type DateType } from '..'
import { derived, get, type Writable } from 'svelte/store'
import { onDestroy } from 'svelte'

export {
  // Svelte import names prohibit a $ prefix, so it's renamed to NOW there
  $NOW as NOW,
  type DateType,
}

export type CreateTimescapeOptions = Writable<{ date?: Date } & Options>

export const createTimescape = (options: CreateTimescapeOptions) => {
  const manager = new TimescapeManager(get(options).date)

  manager.on('changeDate', (nextDate) => {
    options.update((value) => ({ ...value, date: nextDate }))
  })

  options.subscribe((value) => {
    manager.minDate = value.minDate
    manager.maxDate = value.maxDate

    if (value.hour12 !== undefined) manager.hour12 = value.hour12
    if (value.digits !== undefined) manager.digits = value.digits
    if (value.wrapAround !== undefined) manager.wrapAround = value.wrapAround
    if (value.snapToStep !== undefined) manager.snapToStep = value.snapToStep
  })

  const date = derived(options, ($options) => $options.date)

  // Subscribe to the derived store
  date.subscribe((value) => {
    manager.updateDate(value?.getTime())
  })

  const inputProps = (element: HTMLInputElement, type: DateType) =>
    manager.registerElement(element, type)
  const rootProps = (element: HTMLElement) => manager.registerRoot(element)

  onDestroy(() => manager.remove())

  return {
    inputProps,
    rootProps,
  } as const
}
