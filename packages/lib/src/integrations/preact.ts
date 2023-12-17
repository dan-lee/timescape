import {
  TimescapeManager,
  $NOW,
  type DateType,
  type Options,
  type RangeOptions,
} from '../index'
import { useEffect, useState, type MutableRef } from 'preact/hooks'
import * as signals from '@preact/signals'
import { marry } from '../range'

export { $NOW, type DateType, type Options, type RangeOptions }

// This is to prevent the error: "Typescript inferred type cannot be named without reference".
const { useSignalEffect, useSignal } = signals

export const useTimescape = (options: Options = {}) => {
  const [manager] = useState(() => {
    const { date, ...rest } = options
    return new TimescapeManager(date, rest)
  })
  const optionsSignal = useSignal(options)

  useEffect(() => {
    return manager.on('changeDate', (nextDate) => {
      optionsSignal.value = { ...optionsSignal.value, date: nextDate }
    })
  }, [manager, optionsSignal])

  useSignalEffect(() => {
    manager.date = optionsSignal.value.date
    manager.minDate = optionsSignal.value.minDate
    manager.maxDate = optionsSignal.value.maxDate
    manager.digits = optionsSignal.value.digits
    manager.wrapAround = optionsSignal.value.wrapAround
    manager.hour12 = optionsSignal.value.hour12
    manager.snapToStep = optionsSignal.value.snapToStep
  })

  useEffect(() => () => manager.remove(), [manager])

  return {
    _manager: manager,
    getInputProps: (
      type: DateType,
      opts?: { ref?: MutableRef<HTMLInputElement | null>; autofocus?: boolean },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (!element) return
        manager.registerElement(element, type, opts?.autofocus)
        if (opts?.ref) opts.ref.current = element
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
    options: optionsSignal,
  } as const
}

export const useTimescapeRange = (options: RangeOptions = {}) => {
  const from = useTimescape(options.from)
  const to = useTimescape(options.to)

  useEffect(() => {
    marry(from._manager, to._manager)
  }, [from._manager, to._manager])

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
    },
    to: {
      getInputProps: to.getInputProps,
      options: to.options,
    },
  } as const
}
