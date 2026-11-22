import { type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import {
  applyOptions,
  bindDate,
  type DateCallbacks,
  type DateProp,
  toDate,
  warnControlledSwitch,
} from "./shared";

export type HookOptions = Omit<Options, "date"> &
  DateCallbacks & {
    /** Controlled value. `null` is the empty date, `undefined` means uncontrolled. */
    date?: DateProp;
    defaultDate?: DateProp;
  };

export type HookRangeOptions = {
  from?: HookOptions;
  to?: HookOptions;
};

type Ref<T> = ((element: T | null) => unknown) | { current: T | null } | null;

export type InputPropsOptions = {
  ref?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
  /** @deprecated Use the React-style `autoFocus` option instead. */
  autofocus?: boolean;
};

export type RootPropsOptions = {
  /** Focusing the root focuses the first input. */
  ref?: Ref<HTMLElement>;
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

// Return void so detach routes through the same callback in React and Preact.
const composeRef = <T>(
  ref: Ref<T> | undefined,
  attach: (element: T) => void,
) => {
  let cleanup: (() => void) | undefined;

  return (element: T | null) => {
    if (typeof ref === "function") {
      if (element) {
        const result = ref(element);
        cleanup =
          typeof result === "function" ? (result as () => void) : undefined;
      } else {
        cleanup ? cleanup() : ref(null);
        cleanup = undefined;
      }
    } else if (ref) {
      ref.current = element;
    }

    if (element) attach(element);
  };
};

// Mirror the manager's static attributes for server rendering.
const inputProps = {
  type: "text",
  role: "spinbutton",
  autoComplete: "off",
  enterKeyHint: "next",
  spellCheck: false,
  autoCapitalize: "off",
  tabIndex: 0,
  "data-timescape-input": "",
} as const;

const rootProps = { role: "group", tabIndex: -1 } as const;

export const createHooks = ({
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
}: Hooks) => {
  const useTimescape = (options: HookOptions = {}) => {
    const { date, defaultDate, onDateChange, onInputChange, onBlur, ...rest } =
      options;
    const hasInputChange = onInputChange !== undefined;

    // Controlled once, controlled for good: a controlled input reporting an
    // empty date must not turn into an uncontrolled one.
    const isControlledRef = useRef(date !== undefined);
    const isControlled = isControlledRef.current || date !== undefined;

    const [internalDate, setInternalDate] = useState<Date | undefined>(
      isControlled ? undefined : toDate(defaultDate),
    );

    const currentDate = isControlled ? toDate(date) : internalDate;
    const [manager] = useState(() => new TimescapeManager(currentDate, rest));

    const props = { date: currentDate, onDateChange, onInputChange, onBlur };
    const latest = useRef(props);
    const syncRef = useRef<((date: Date | undefined) => void) | undefined>(
      undefined,
    );

    useLayoutEffect(() => {
      latest.current = props;
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
        getDate: () => latest.current.date,
        setDate: setInternalDate,
        onDateChange: (nextDate) => latest.current.onDateChange?.(nextDate),
        onInputChange: hasInputChange
          ? (nextDate, details) =>
              latest.current.onInputChange?.(nextDate, details)
          : undefined,
        onBlur: () => latest.current.onBlur?.(),
      });
      syncRef.current = dateBinding.sync;
      dateBinding.sync(latest.current.date);

      return () => {
        syncRef.current = undefined;
        dateBinding.unsubscribe();
      };
    }, [manager, isControlled, hasInputChange]);

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
      getInputProps: (type: DateType, opts: InputPropsOptions = {}) => {
        const autoFocus = opts.autoFocus ?? opts.autofocus;
        return {
          ...inputProps,
          inputMode: type === "am/pm" ? undefined : ("numeric" as const),
          autoFocus,
          // Preact sets the autofocus attribute without focusing on mount.
          ref: composeRef(opts.ref, (element: HTMLInputElement) =>
            manager.registerElement(element, type, autoFocus),
          ),
        };
      },
      getRootProps: (opts: RootPropsOptions = {}) => ({
        ...rootProps,
        ref: composeRef(opts.ref, (element: HTMLElement) =>
          manager.registerRoot(element),
        ),
      }),
      focusField: (type?: DateType) => manager.focusField(type),
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

    const fields = ({ getInputProps, focusField, ampm }: typeof from) => ({
      getInputProps,
      focusField,
      ampm,
    });

    return {
      getRootProps: (opts: RootPropsOptions = {}) => ({
        ...rootProps,
        ref: composeRef(opts.ref, (element: HTMLElement) => {
          from._manager.registerRoot(element);
          to._manager.registerRoot(element);
        }),
      }),
      from: fields(from),
      to: fields(to),
    } as const;
  };

  return { useTimescape, useTimescapeRange };
};
