import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export {
  $NOW,
  type DateType,
  type ReactOptions as Options,
  type ReactRangeOptions as RangeOptions,
};

export type ReactOptions = Options & {
  defaultDate?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
};

export type ReactRangeOptions = {
  from?: ReactOptions;
  to?: ReactOptions;
};

export const useTimescape = (options: ReactOptions = {}) => {
  const { date, defaultDate, onChange, ...rest } = options;
  const isControlled = date !== undefined;

  const [internalDate, setInternalDate] = useState<Date | undefined>(
    isControlled ? undefined : defaultDate,
  );

  const currentDate = isControlled ? date : internalDate;
  const [manager] = useState(() => new TimescapeManager(currentDate, rest));
  const onChangeRef = useRef(onChange);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    return manager.on("changeDate", (nextDate) => {
      if (!isControlled) {
        setInternalDate(nextDate);
      } else {
        // Basically makes this a controlled component
        manager.date = currentDate?.getTime();
      }
      onChangeRef.current?.(nextDate);
    });
  }, [manager, isControlled, currentDate]);

  useEffect(() => {
    manager.date = currentDate?.getTime();
  }, [manager, currentDate]);

  useEffect(() => {
    manager.minDate = rest.minDate;
    manager.maxDate = rest.maxDate;
    manager.hour12 = rest.hour12;
    manager.wrapAround = rest.wrapAround;
    manager.digits = rest.digits;
    manager.snapToStep = rest.snapToStep;
    manager.wheelControl = rest.wheelControl;
    manager.disallowPartial = rest.disallowPartial;
  }, [
    manager,
    rest.minDate,
    rest.maxDate,
    rest.hour12,
    rest.wrapAround,
    rest.digits,
    rest.snapToStep,
    rest.wheelControl,
    rest.disallowPartial,
  ]);

  useEffect(() => {
    // Handle StrictMode double-mounting
    manager.resync();
    return () => manager.remove();
  }, [manager]);

  return {
    _manager: manager,
    getInputProps: (
      type: DateType,
      opts?: {
        ref?: RefObject<HTMLInputElement | null>;
        autofocus?: boolean;
      },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (!element) return;
        manager.registerElement(element, type, opts?.autofocus);
        if (opts?.ref) opts.ref.current = element;
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) => {
        if (element) manager.registerRoot(element);
      },
    }),
    ampm: createAmPmHandler(manager),
  } as const;
};

export const useTimescapeRange = (options: ReactRangeOptions = {}) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  useEffect(() => {
    marry(from._manager, to._manager);
  }, [from._manager, to._manager]);

  return {
    getRootProps: () => ({
      ref: (element: HTMLElement | null) => {
        if (!element) return;
        from._manager.registerRoot(element);
        to._manager.registerRoot(element);
      },
    }),
    from: { getInputProps: from.getInputProps, ampm: from.ampm },
    to: { getInputProps: to.getInputProps, ampm: to.ampm },
  } as const;
};
