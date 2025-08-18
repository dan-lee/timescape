import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export { $NOW, type DateType };

type BaseOptions = Omit<Options, "date">;

export type SolidOptions = BaseOptions & {
  date?: Accessor<Date | undefined>;
  defaultDate?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
};

export type SolidRangeOptions = {
  from?: SolidOptions;
  to?: SolidOptions;
};

export const useTimescape = (options: SolidOptions = {}) => {
  const { date, defaultDate, onChange, ...rest } = options;

  const isControlled = date !== undefined;

  const [internalDate, setInternalDate] = createSignal<Date | undefined>(
    isControlled ? undefined : defaultDate,
  );

  const currentDate = () => {
    if (isControlled) {
      return typeof date === "function" ? date() : date;
    }
    return internalDate();
  };

  const manager = new TimescapeManager(currentDate(), rest);

  const unsubscribe = manager.on("changeDate", (nextDate) => {
    onChange?.(nextDate);

    if (!isControlled) {
      setInternalDate(nextDate);
    }
  });

  onCleanup(unsubscribe);

  createEffect(() => {
    manager.date = currentDate();
  });

  createEffect(() => {
    manager.minDate = rest.minDate;
    manager.maxDate = rest.maxDate;
    manager.hour12 = rest.hour12;
    manager.digits = rest.digits;
    manager.wrapAround = rest.wrapAround;
    manager.snapToStep = rest.snapToStep;
    manager.wheelControl = rest.wheelControl;
    manager.disallowPartial = rest.disallowPartial;
  });

  onCleanup(() => manager.remove());

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
    ampm: createAmPmHandler(manager),
  } as const;
};

export const useTimescapeRange = (options: SolidRangeOptions = {}) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  marry(from._manager, to._manager);

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
