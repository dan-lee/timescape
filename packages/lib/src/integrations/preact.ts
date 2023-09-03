import { TimescapeManager, $NOW, type DateType, type Options } from '..'
import { useEffect, useState, type MutableRef } from 'preact/hooks'
import { useSignalEffect, type Signal, useSignal } from '@preact/signals'

export { $NOW, type DateType }

type UseTimescapeOptions = Signal<{ date?: Date } & Options>

export const useTimescape = (options: UseTimescapeOptions) => {
  const [manager] = useState(() => new TimescapeManager(options.value.date))

  manager.on('changeDate', (nextDate) => {
    options.value = { ...options.value, date: nextDate }
  })

  useSignalEffect(() => {
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
    manager,
  } as const
}

export const useTimescapeRange = (
  options: Signal<
    {
      fromDate?: Date
      toDate?: Date
      onChangeFromDate?: (nextDate: Date | undefined) => void
      onChangeToDate?: (nextDate: Date | undefined) => void
    } & Options
  >,
) => {
  const { fromDate, onChangeFromDate, ...fromRest } = options.value
  const fromProps = useSignal({
    date: fromDate,
    onChangeDate: onChangeFromDate,
    ...fromRest,
  })

  const { toDate, onChangeToDate, ...rest } = options.value
  const toProps = useSignal({
    date: toDate,
    onChangeDate: onChangeToDate,
    ...rest,
  })

  const from = useTimescape(fromProps)
  const to = useTimescape(toProps)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    const unsubFrom = from.manager.on('focusWrap', (type) => {
      to.manager.focusField(type === 'start' ? -1 : 0)
    })
    const unsubTo = to.manager.on('focusWrap', (type) => {
      from.manager.focusField(type === 'end' ? 0 : -1)
    })

    return () => {
      unsubFrom()
      unsubTo()
    }
  }, [to.manager, from.manager])

  useEffect(() => {
    const validate = () => {
      setIsValid(
        (from.manager.date?.getTime() ?? 0) <=
          (to.manager.date?.getTime() ?? 0),
      )
    }

    const unsubFrom = from.manager.on('changeDate', validate)
    const unsubTo = to.manager.on('changeDate', validate)

    return () => {
      unsubFrom()
      unsubTo()
    }
  }, [from.manager, to.manager])

  return {
    isValid,
    from: {
      getInputProps: from.getInputProps,
      getRootProps: from.getRootProps,
    },
    to: {
      getInputProps: to.getInputProps,
      getRootProps: to.getRootProps,
    },
  } as const
}
