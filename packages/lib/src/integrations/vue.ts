import { TimescapeManager, $NOW, type Options, type DateType } from '..'
import { onUnmounted, watch } from 'vue'

export { $NOW, type DateType }

export type UseTimescapeOptions = { date?: Date } & Options

export function useTimescape(options: UseTimescapeOptions) {
  const manager = new TimescapeManager(options.date)

  manager.subscribe((nextDate) => {
    options.date = nextDate
  })

  watch(
    () => [
      options.minDate,
      options.maxDate,
      options.hour12,
      options.wrapAround,
      options.digits,
    ],
    ([minDate, maxDate, hour12, wrapAround, digits]) => {
      manager.minDate = minDate as UseTimescapeOptions['minDate']
      manager.maxDate = maxDate as UseTimescapeOptions['maxDate']

      if (hour12 !== undefined)
        manager.hour12 = hour12 as UseTimescapeOptions['hour12']
      if (digits !== undefined)
        manager.digits = digits as UseTimescapeOptions['digits']
      if (wrapAround !== undefined)
        manager.wrapAround = wrapAround as UseTimescapeOptions['wrapAround']
    },
    { immediate: true },
  )

  watch(
    () => options.date,
    (nextDate) => (manager.date = nextDate),
  )

  onUnmounted(() => manager.remove())

  return {
    registerElement: (type: DateType) => (element: HTMLInputElement | null) =>
      element && manager.registerElement(element, type),
    registerRoot: () => (element: HTMLElement | null) =>
      element && manager.registerRoot(element),
  } as const
}
