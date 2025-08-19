import { type MutableRef, useEffect, useRef, useState } from "preact/hooks";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export { $NOW, type DateType };

type BaseOptions = Omit<Options, "date">;

export type PreactOptions = BaseOptions & {
  date?: Date | undefined;
  defaultDate?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
};

export type PreactRangeOptions = {
  from?: PreactOptions;
  to?: PreactOptions;
};

export const useTimescape = (options: PreactOptions = {}) => {
  const { date, defaultDate, onChange, ...rest } = options;

  const isControlled = date !== undefined;

  const [internalDate, setInternalDate] = useState<Date | undefined>(
    isControlled ? undefined : defaultDate,
  );

  const currentDate = isControlled ? date : internalDate;
  const [manager] = useState(() => new TimescapeManager(currentDate, rest));
  const onChangeRef = useRef(onChange);

  useEffect(() => {
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
    manager.digits = rest.digits;
    manager.wrapAround = rest.wrapAround;
    manager.hour12 = rest.hour12;
    manager.snapToStep = rest.snapToStep;
    manager.wheelControl = rest.wheelControl;
    manager.disallowPartial = rest.disallowPartial;
  }, [
    manager,
    rest.minDate,
    rest.maxDate,
    rest.digits,
    rest.wrapAround,
    rest.hour12,
    rest.snapToStep,
    rest.wheelControl,
    rest.disallowPartial,
  ]);

  useEffect(() => () => manager.remove(), [manager]);

  return {
    _manager: manager,
    getInputProps: (
      type: DateType,
      opts?: { ref?: MutableRef<HTMLInputElement | null>; autofocus?: boolean },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (!element) return;
        manager.registerElement(element, type, opts?.autofocus);
        if (opts?.ref) opts.ref.current = element;
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
    ampm: createAmPmHandler(manager),
  } as const;
};

export const useTimescapeRange = (options: PreactRangeOptions = {}) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  useEffect(() => {
    marry(from._manager, to._manager);
  }, [from._manager, to._manager]);

  return {
    getRootProps: () => ({
      ref: (element: HTMLElement | null) => {
        if (element) {
          from._manager.registerRoot(element);
          to._manager.registerRoot(element);
        }
      },
    }),
    from: {
      getInputProps: from.getInputProps,
      ampm: from.ampm,
    },
    to: {
      getInputProps: to.getInputProps,
      ampm: to.ampm,
    },
  } as const;
};
