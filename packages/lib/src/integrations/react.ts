import { TimescapeManager, $NOW, type DateType, type Options } from '..'
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  type MutableRefObject,
} from 'react'

export { $NOW, type DateType }

type TimescapeOptions = {
  date?: Date
  onChangeDate?: (nextDate: Date | undefined) => void
} & Options

export const useTimescape = ({
  date,
  minDate,
  maxDate,
  hour12 = false,
  wrapAround = false,
  digits = '2-digit',
  snapToStep = false,
  onChangeDate,
}: TimescapeOptions) => {
  const manager = useRef(new TimescapeManager(date))
  const timestamp = date?.getTime()
  const onChangeDateRef = useRef(onChangeDate)
  useLayoutEffect(() => {
    onChangeDateRef.current = onChangeDate
  }, [onChangeDate])

  useEffect(() => {
    manager.current.resync()

    return () => {
      manager.current.remove()
    }
  }, [])

  useEffect(() => {
    if (!manager.current) return
    manager.current.date = timestamp
  }, [timestamp])

  useEffect(() => {
    return manager.current?.on('changeDate', (nextDate) => {
      onChangeDateRef.current?.(nextDate)
    })
  }, [])

  useEffect(() => {
    if (!manager.current) return

    manager.current.minDate = minDate
    manager.current.maxDate = maxDate

    if (hour12 !== undefined) manager.current.hour12 = hour12
    if (wrapAround !== undefined) manager.current.wrapAround = wrapAround
    if (digits !== undefined) manager.current.digits = digits
    if (snapToStep !== undefined) manager.current.snapToStep = snapToStep
  }, [minDate, maxDate, hour12, wrapAround, digits, snapToStep])

  return {
    getInputProps: (
      type: DateType,
      opts?: {
        ref?: MutableRefObject<HTMLInputElement | null>
        autofocus?: boolean
      },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (element) {
          manager.current?.registerElement(element, type, opts?.autofocus)
          if (opts?.ref) opts.ref.current = element
        }
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.current?.registerRoot(element),
    }),
    manager: manager.current,
  } as const
}

export const useTimescapeRange = ({
  fromDate,
  toDate,
  onChangeFromDate,
  onChangeToDate,
  ...rest
}: {
  fromDate?: Date
  toDate?: Date
  onChangeFromDate?: (nextDate: Date | undefined) => void
  onChangeToDate?: (nextDate: Date | undefined) => void
} & Options) => {
  const from = useTimescape({
    date: fromDate,
    onChangeDate: onChangeFromDate,
    ...rest,
  })

  const to = useTimescape({
    date: toDate,
    onChangeDate: onChangeToDate,
    ...rest,
  })
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
