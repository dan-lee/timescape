import {
  TimescapeManager,
  $NOW,
  type DateType,
  type Options,
  type RangeOptions,
} from '../index'
import { marry } from '../range'
import { createEffect, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'

export { $NOW, type DateType, type Options, type RangeOptions }

export const useTimescape = (options: Options = {}) => {
  const [optionsStore, update] = createStore<Options>(options)
  const { date, ...rest } = options
  const manager = new TimescapeManager(date, rest)

  createEffect(() => {
    manager.on('changeDate', (nextDate) => {
      update('date', nextDate)
    })
  })

  createEffect(() => {
    manager.date = optionsStore.date
    manager.minDate = optionsStore.minDate
    manager.maxDate = optionsStore.maxDate
    manager.hour12 = optionsStore.hour12
    manager.digits = optionsStore.digits
    manager.wrapAround = optionsStore.wrapAround
    manager.snapToStep = optionsStore.snapToStep
    manager.wheelControl = optionsStore.wheelControl
    manager.disallowPartial = optionsStore.disallowPartial
  })

  onCleanup(() => manager.remove())

  return {
    _manager: manager,
    getInputProps: (type: DateType) => ({
      ref: (element: HTMLInputElement | null) =>
        element && manager.registerElement(element, type),
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
    update,
    options: optionsStore,
  } as const
}

export const useTimescapeRange = (options: RangeOptions = {}) => {
  const from = useTimescape(options.from)
  const to = useTimescape(options.to)

  marry(from._manager, to._manager)

  return {
    getRootProps: () => ({
      ref: (element: HTMLElement | null) => {
        if (!element) return
        from._manager.registerRoot(element)
        to._manager.registerRoot(element)
      },
    }),
    from: {
      getInputProps: from.getInputProps,
      options: from.options,
      update: from.update,
    },
    to: {
      getInputProps: to.getInputProps,
      options: to.options,
      update: to.update,
    },
  } as const
}
