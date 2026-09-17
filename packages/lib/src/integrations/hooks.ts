import { type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import {
  applyOptions,
  bindDate,
  type DateProp,
  toDate,
  warnControlledSwitch,
} from "./shared";

export type HookOptions = Omit<Options, "date"> & {
  /** Controlled value. `null` is the empty date, `undefined` means uncontrolled. */
  date?: DateProp;
  defaultDate?: DateProp;
  onDateChange?: (date: Date | null) => void;
};

export type HookRangeOptions = {
  from?: HookOptions;
  to?: HookOptions;
};

export type InputPropsOptions = {
  ref?: { current: HTMLInputElement | null };
  autofocus?: boolean;
};

type Effect = () => undefined | (() => void);

/**
 * React and Preact expose the same hooks with different types, so both
 * integrations are built from this one implementation.
 */
export type Hooks = {
  useState: <S>(initial: S | (() => S)) => [S, (next: S) => void];
  useRef: <T>(initial: T) => { current: T };
  useEffect: (effect: Effect, deps?: unknown[]) => void;
  useLayoutEffect: (effect: Effect, deps?: unknown[]) => void;
};

export const createHooks = ({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
}: Hooks) => {
  const useTimescape = (options: HookOptions = {}) => {
    const { date, defaultDate, onDateChange, ...rest } = options;

    // Controlled once, controlled for good: a controlled input reporting an
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
      return undefined;
    });

    useEffect(() => {
      if (isControlled && !isControlledRef.current) {
        isControlledRef.current = true;
        warnControlledSwitch();
      }
      return undefined;
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
      return undefined;
    }, [currentDate]);

    useEffect(() => {
      applyOptions(manager, rest);
      return undefined;
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
      getInputProps: (type: DateType, opts?: InputPropsOptions) => ({
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

  const useTimescapeRange = (options: HookRangeOptions = {}) => {
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

  return { useTimescape, useTimescapeRange };
};
