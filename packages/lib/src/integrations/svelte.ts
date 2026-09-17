import { onDestroy } from "svelte";
import type { Action } from "svelte/action";
import { type Readable, writable } from "svelte/store";
import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export {
  // Svelte import names prohibit a $ prefix, so it's renamed to NOW there
  $NOW as NOW,
  type DateType,
};

type BaseOptions = Omit<Options, "date">;

export type SvelteOptions = BaseOptions & {
  date?: Readable<Date | undefined>;
  defaultDate?: Date | undefined;
  onChangeDate?: (date: Date | undefined) => void;
};

export type SvelteRangeOptions = {
  from?: SvelteOptions;
  to?: SvelteOptions;
};

export const createTimescape = (options: SvelteOptions = {}) => {
  const { date, defaultDate, onChangeDate, ...rest } = options;

  const isControlled = date !== undefined;

  const internalStore = writable<Date | undefined>(
    isControlled ? undefined : defaultDate,
  );

  const dateStore = isControlled ? date : internalStore;

  let currentValue: Date | undefined;
  dateStore.subscribe((value) => {
    currentValue = value;
  })();

  const manager = new TimescapeManager(currentValue, rest);

  // Programmatic writes to `manager.date` (syncing the store, or snapping back
  // in controlled mode) emit `changeDate` too. This flag lets us ignore those
  // echoes so `onChangeDate` only fires for genuine user edits.
  let suppressChange = false;
  const applyDate = (nextDate: Date | undefined) => {
    suppressChange = true;
    manager.date = nextDate;
    suppressChange = false;
  };

  manager.on("changeDate", (nextDate) => {
    if (suppressChange) return;

    if (isControlled) {
      onChangeDate?.(nextDate);
      // Snap back to the controlled value; the parent must update the `date`
      // store to accept the change.
      applyDate(currentValue);
    } else {
      internalStore.set(nextDate);
      onChangeDate?.(nextDate);
    }
  });

  const unsubscribeDate = dateStore.subscribe((value) => {
    currentValue = value;
    applyDate(value);
  });

  onDestroy(() => {
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

  marry(from._manager, to._manager);

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
