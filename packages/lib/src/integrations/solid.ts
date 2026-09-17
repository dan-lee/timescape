import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import { applyOptions, bindDate, type DateProp, toDate } from "./shared";

export {
  $NOW,
  type DateType,
  type SolidOptions as Options,
  type SolidRangeOptions as RangeOptions,
};

type BaseOptions = Omit<Options, "date">;

export type SolidOptions = BaseOptions & {
  /** Passing an accessor makes the input controlled; its `null` is the empty date. */
  date?: Accessor<DateProp>;
  defaultDate?: DateProp;
  onDateChange?: (date: Date | null) => void;
};

export type SolidRangeOptions = {
  from?: SolidOptions;
  to?: SolidOptions;
};

export const useTimescape = (options: SolidOptions = {}) => {
  const { date, defaultDate, onDateChange, ...rest } = options;

  const isControlled = date !== undefined;

  const [internalDate, setInternalDate] = createSignal<Date | undefined>(
    isControlled ? undefined : toDate(defaultDate),
  );

  const currentDate = () =>
    date !== undefined ? toDate(date()) : internalDate();

  const manager = new TimescapeManager(currentDate(), rest);

  const dateBinding = bindDate(manager, {
    controlled: isControlled,
    getDate: currentDate,
    setDate: setInternalDate,
    onDateChange,
  });

  onCleanup(dateBinding.unsubscribe);

  createEffect(() => {
    dateBinding.sync(currentDate());
  });

  createEffect(() => applyOptions(manager, options));

  onCleanup(() => manager.remove());

  return {
    /** @internal */
    _manager: manager,
    getInputProps: (type: DateType) => ({
      ref: (element: HTMLInputElement | null) => {
        if (element) manager.registerElement(element, type);
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

export const useTimescapeRange = (options: SolidRangeOptions = {}) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  onCleanup(marry(from._manager, to._manager));

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
