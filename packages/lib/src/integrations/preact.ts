import { TimescapeManager, $NOW, type DateType, type Options } from '..'
import { useEffect, useState, type MutableRef } from 'preact/hooks'
import { effect, type Signal } from '@preact/signals'

export { $NOW, type DateType }

type UseTimescapeOptions = Signal<{ date?: Date } & Options>

export const useTimescape = (options: UseTimescapeOptions) => {
  const [manager] = useState(() => new TimescapeManager(options.value.date))

  manager.on('changeDate', (nextDate) => {
    options.value = { ...options.value, date: nextDate }
  })

  effect(() => {
    manager.date = options.value.date
    manager.minDate = options.value.minDate
    manager.maxDate = options.value.maxDate

    if (options.value.digits !== undefined)
      manager.hour12 = options.value.hour12
    if (options.value.digits !== undefined)
      manager.digits = options.value.digits
    if (options.value.wrapAround !== undefined)
      manager.wrapAround = options.value.wrapAround
    if (options.value.hour12 !== undefined)
      manager.hour12 = options.value.hour12
    if (options.value.snapToStep !== undefined)
      manager.snapToStep = options.value.snapToStep
  })

  useEffect(() => () => manager.remove(), [manager])

  return {
    getInputProps: (
      type: DateType,
      opts?: { ref?: MutableRef<HTMLInputElement | null>; autofocus?: boolean },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (element) {
          manager.registerElement(element, type, opts?.autofocus)
          if (opts?.ref) opts.ref.current = element
        }
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
  } as const
}
