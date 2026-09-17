import {
  type ComponentPublicInstance,
  computed,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";

import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import { applyOptions, bindDate, type DateProp, toDate } from "./shared";

export {
  $NOW,
  type DateType,
  type VueOptions as Options,
  type VueRangeOptions as RangeOptions,
};

type BaseOptions = Omit<Options, "date">;

/** Any ref-like holder, so `Ref<Date>`, `Ref<Date | null>` and `computed` all fit. */
export type DateRef = { readonly value: DateProp };

export type VueOptions = BaseOptions & {
  /** Passing a ref makes the input controlled; its `null` is the empty date. */
  date?: DateRef;
  defaultDate?: DateProp;
  onDateChange?: (date: Date | null) => void;
};

export type VueRangeOptions = {
  from?: VueOptions;
  to?: VueOptions;
};

export const useTimescape = (options: VueOptions = {}) => {
  const { date, defaultDate, onDateChange, ...rest } = options;

  const isControlled = date !== undefined;

  const internalDate = ref<Date | undefined>(
    isControlled ? undefined : toDate(defaultDate),
  );

  const currentDate = computed(() =>
    date !== undefined ? toDate(date.value) : internalDate.value,
  );

  const manager = new TimescapeManager(currentDate.value, rest);

  const dateBinding = bindDate(manager, {
    controlled: isControlled,
    getDate: () => currentDate.value,
    setDate: (nextDate) => {
      internalDate.value = nextDate;
    },
    onDateChange,
  });

  watch(currentDate, dateBinding.sync);

  watchEffect(() => applyOptions(manager, options));

  onUnmounted(() => {
    dateBinding.unsubscribe();
    manager.remove();
  });

  return {
    /** @internal */
    _manager: manager,
    registerElement:
      (type: DateType) =>
      (element: Element | ComponentPublicInstance | null) => {
        if (element instanceof HTMLInputElement) {
          manager.registerElement(element, type);
        }
      },
    registerRoot: () => (element: Element | ComponentPublicInstance | null) => {
      if (element instanceof HTMLElement) {
        manager.registerRoot(element);
      }
    },
    ampm: createAmPmHandler(manager),
  } as const;
};

export const useTimescapeRange = (options: VueRangeOptions = {}) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  const divorce = marry(from._manager, to._manager);
  onUnmounted(divorce);

  return {
    registerRangeRoot:
      () => (element: Element | ComponentPublicInstance | null) => {
        if (element instanceof HTMLElement) {
          from._manager.registerRoot(element);
          to._manager.registerRoot(element);
        }
      },
    from: { registerElement: from.registerElement, ampm: from.ampm },
    to: { registerElement: to.registerElement, ampm: to.ampm },
  } as const;
};
