import {
  type ComponentPublicInstance,
  computed,
  onUnmounted,
  type Ref,
  ref,
  watch,
  watchEffect,
} from "vue";

import { $NOW, type DateType, type Options, TimescapeManager } from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";
import { bindDate } from "./shared";

export { $NOW, type DateType };

type BaseOptions = Omit<Options, "date">;

export type VueOptions = BaseOptions & {
  date?: Ref<Date | undefined>;
  defaultDate?: Date | undefined;
  onChangeDate?: (date: Date | undefined) => void;
};

export type VueRangeOptions = {
  from?: VueOptions;
  to?: VueOptions;
};

export const useTimescape = (options: VueOptions = {}) => {
  const { date, defaultDate, onChangeDate, ...rest } = options;

  const isControlled = date !== undefined;

  const internalDate = ref<Date | undefined>(
    isControlled ? undefined : defaultDate,
  );

  const currentDate = computed(() => {
    if (date !== undefined) {
      return date.value;
    }
    return internalDate.value;
  });

  const manager = new TimescapeManager(currentDate.value, rest);

  const dateBinding = bindDate(manager, {
    controlled: isControlled,
    getDate: () => currentDate.value,
    setDate: (nextDate) => {
      internalDate.value = nextDate;
    },
    onChangeDate,
  });

  watch(currentDate, dateBinding.sync);

  watchEffect(() => {
    manager.minDate = options.minDate;
    manager.maxDate = options.maxDate;
    manager.digits = options.digits;
    manager.wrapAround = options.wrapAround;
    manager.hour12 = options.hour12;
    manager.snapToStep = options.snapToStep;
    manager.wheelControl = options.wheelControl;
    manager.disallowPartial = options.disallowPartial;
  });

  onUnmounted(() => {
    dateBinding.unsubscribe();
    manager.remove();
  });

  return {
    _manager: manager,
    registerElement:
      (type: DateType) => (element: Element | ComponentPublicInstance | null) =>
        element instanceof HTMLInputElement &&
        manager.registerElement(element, type),
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

  marry(from._manager, to._manager);

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
