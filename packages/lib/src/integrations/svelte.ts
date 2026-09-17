import { onDestroy } from "svelte";
import type { Action } from "svelte/action";
import { get, type Readable, writable } from "svelte/store";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import { bindDate, type DateProp, toDate } from "./shared";

export {
  // Svelte import names prohibit a $ prefix, so it's renamed to NOW there
  $NOW as NOW,
  type DateType,
  type SvelteOptions as Options,
  type SvelteRangeOptions as RangeOptions,
};

type BaseOptions = Omit<Options, "date">;

export type SvelteOptions = BaseOptions & {
  /** Passing a store makes the input controlled; its `null` is the empty date. */
  date?: Readable<DateProp>;
  /** Initial value for uncontrolled usage. */
  defaultDate?: DateProp;
  onDateChange?: (date: Date | null) => void;
};

export type SvelteRangeOptions = {
  from?: SvelteOptions;
  to?: SvelteOptions;
};

export const createTimescape = (options: SvelteOptions = {}) => {
  const { date, defaultDate, onDateChange, ...rest } = options;

  const isControlled = date !== undefined;

  const internalStore = writable<Date | undefined>(
    isControlled ? undefined : toDate(defaultDate),
  );

  const dateStore = isControlled ? date : internalStore;

  let currentValue = toDate(get(dateStore));

  const manager = new TimescapeManager(currentValue, rest);

  const dateBinding = bindDate(manager, {
    controlled: isControlled,
    getDate: () => currentValue,
    setDate: (nextDate) => internalStore.set(nextDate),
    onDateChange,
  });

  const unsubscribeDate = dateStore.subscribe((value) => {
    currentValue = toDate(value);
    dateBinding.sync(currentValue);
  });

  onDestroy(() => {
    dateBinding.unsubscribe();
    manager.remove();
    unsubscribeDate();
  });

  const inputProps: Action<HTMLInputElement, DateType> = (element, type) => {
    manager.registerElement(element as HTMLInputElement, type as DateType);
  };
  const rootProps: Action<HTMLElement, void> = (element) => {
    manager.registerRoot(element as HTMLElement);
  };

  return {
    /** @internal */
    _manager: manager,
    inputProps,
    rootProps,
    ampm: createAmPmHandler(manager),
    date: dateStore,
  } as const;
};

export const createTimescapeRange = (options: SvelteRangeOptions = {}) => {
  const from = createTimescape(options.from);
  const to = createTimescape(options.to);

  onDestroy(marry(from._manager, to._manager));

  const rootProps: Action<HTMLElement, void> = (element) => {
    from._manager.registerRoot(element as HTMLElement);
    to._manager.registerRoot(element as HTMLElement);
  };

  return {
    rootProps,
    from: { inputProps: from.inputProps, ampm: from.ampm, date: from.date },
    to: { inputProps: to.inputProps, ampm: to.ampm, date: to.date },
  } as const;
};
