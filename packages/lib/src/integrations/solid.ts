import { TimescapeManager, $NOW, type DateType, type Options } from '..'
import { createEffect, onCleanup, type Signal } from 'solid-js'

export { $NOW, type DateType }

type TimescapeOptions = Signal<{ date?: Date } & Options>

export const useTimescape = ([options, setOptions]: TimescapeOptions) => {
  const manager = new TimescapeManager(options().date)

  createEffect(() => {
    manager.subscribe((nextDate) => {
      setOptions((options) => ({ ...options, date: nextDate }))
    })
  })

  createEffect(() => {
    manager.date = options().date
    manager.minDate = options().minDate
    manager.maxDate = options().maxDate

    if (options().hour12 !== undefined) manager.hour12 = options().hour12
    if (options().digits !== undefined) manager.digits = options().digits
    if (options().wrapAround !== undefined)
      manager.wrapAround = options().wrapAround
  })

  onCleanup(() => manager.remove())

  return {
    getInputProps: (type: DateType) => ({
      ref: (element: HTMLInputElement | null) =>
        element && manager.registerElement(element, type),
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
  } as const
}
