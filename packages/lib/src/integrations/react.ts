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
import {
  bindDate,
  type DateProp,
  toDate,
  warnControlledSwitch,
} from "./shared";

export {
  $NOW,
  type DateType,
  type ReactOptions as Options,
  type ReactRangeOptions as RangeOptions,
};

export type ReactOptions = Omit<Options, "date"> & {
  /** Controlled value. `null` is the empty date, `undefined` means uncontrolled. */
  date?: DateProp;
  /** Initial value for uncontrolled usage. */
  defaultDate?: DateProp;
  onDateChange?: (date: Date | null) => void;
};

export type ReactRangeOptions = {
  from?: ReactOptions;
  to?: ReactOptions;
};

export const useTimescape = (options: ReactOptions = {}) => {
  const { date, defaultDate, onDateChange, ...rest } = options;

  // Controlled once, controlled for good: a controlled input that reports an
  // empty date must not turn into an uncontrolled one.
  const isControlledRef = useRef(date !== undefined);
  const isControlled = isControlledRef.current || date !== undefined;

  const [internalDate, setInternalDate] = useState<Date | undefined>(
    isControlled ? undefined : toDate(defaultDate),
  );

  const currentDate = isControlled ? toDate(date) : internalDate;
  const [manager] = useState(() => new TimescapeManager(currentDate, rest));

  const onDateChangeRef = useRef(onDateChange);
  const currentDateRef = useRef(currentDate);
  const syncRef = useRef<((date: Date | undefined) => void) | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    onDateChangeRef.current = onDateChange;
    currentDateRef.current = currentDate;
  });

  useEffect(() => {
    if (isControlled && !isControlledRef.current) {
      isControlledRef.current = true;
      warnControlledSwitch();
    }
  }, [isControlled]);

  useEffect(() => {
    const dateBinding = bindDate(manager, {
      controlled: isControlled,
      getDate: () => currentDateRef.current,
      setDate: setInternalDate,
      onDateChange: (nextDate) => onDateChangeRef.current?.(nextDate),
    });
    syncRef.current = dateBinding.sync;
    dateBinding.sync(currentDateRef.current);

    return () => {
      syncRef.current = undefined;
      dateBinding.unsubscribe();
    };
  }, [manager, isControlled]);

  useEffect(() => {
    syncRef.current?.(currentDate);
  }, [currentDate]);

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
    /** @internal */
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

  useEffect(
    () => marry(from._manager, to._manager),
    [from._manager, to._manager],
  );

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
