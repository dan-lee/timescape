import { TimescapeManager, $NOW, type DateType, type Options } from '..'
import {
  useEffect,
  useState,
  useRef,
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
  onChangeDate,
}: TimescapeOptions) => {
  const [manager] = useState(() => new TimescapeManager(date))
  const timestamp = date?.getTime()
  const onChangeDateRef = useRef(onChangeDate)

  useLayoutEffect(() => {
    onChangeDateRef.current = onChangeDate
  }, [onChangeDate])

  useEffect(() => {
    manager.date = timestamp
  }, [manager, timestamp])

  useEffect(() => {
    manager.subscribe((nextDate) => {
      onChangeDateRef.current?.(nextDate)
    })
  }, [manager])

  useEffect(() => {
    manager.minDate = minDate
    manager.maxDate = maxDate

    if (hour12 !== undefined) manager.hour12 = hour12
    if (wrapAround !== undefined) manager.wrapAround = wrapAround
    if (digits !== undefined) manager.digits = digits
  }, [manager, minDate, maxDate, hour12, wrapAround, digits])

  useEffect(() => () => manager.remove(), [manager])

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
