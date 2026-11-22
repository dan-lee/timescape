import {
  type ComponentPublicInstance,
  computed,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";

import { type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import {
  applyOptions,
  bindDate,
  type DateCallbacks,
  type DateProp,
  toDate,
} from "./shared";

export { $NOW, type InputChangeDetails, type InputState } from "../index";
export type {
  DateType,
  VueOptions as Options,
  VueRangeOptions as RangeOptions,
};

type BaseOptions = Omit<Options, "date"> & DateCallbacks;

/** Any ref-like holder, so `Ref<Date>`, `Ref<Date | null>` and `computed` all fit. */
export type DateRef = { readonly value: DateProp };

export type VueOptions = BaseOptions & {
  /** Passing a ref makes the input controlled; its `null` is the empty date. */
  date?: DateRef;
  defaultDate?: DateProp;
};

export type VueRangeOptions = {
  from?: VueOptions;
  to?: VueOptions;
};

export const useTimescape = (options: VueOptions = {}) => {
  const { date, defaultDate, onDateChange, onInputChange, onBlur, ...rest } =
    options;

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
    onInputChange,
    onBlur,
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
    focusField: (type?: DateType) => manager.focusField(type),
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
    from: {
      registerElement: from.registerElement,
      focusField: from.focusField,
      ampm: from.ampm,
    },
    to: {
      registerElement: to.registerElement,
      focusField: to.focusField,
      ampm: to.ampm,
    },
  } as const;
};
