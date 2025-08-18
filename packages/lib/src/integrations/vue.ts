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

export { $NOW, type DateType };

type BaseOptions = Omit<Options, "date">;

export type VueOptions = BaseOptions & {
  date?: Ref<Date | undefined>;
  defaultDate?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
};

export type VueRangeOptions = {
  from?: VueOptions;
  to?: VueOptions;
};

export const useTimescape = (options: VueOptions = {}) => {
  const { date, defaultDate, onChange, ...rest } = options;

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

  manager.on("changeDate", (nextDate) => {
    onChange?.(nextDate);

    if (!isControlled) {
      internalDate.value = nextDate;
    }
  });

  watch(currentDate, (newDate) => {
    manager.date = newDate;
  });

  watchEffect(() => {
    manager.minDate = rest.minDate;
    manager.maxDate = rest.maxDate;
    manager.digits = rest.digits;
    manager.wrapAround = rest.wrapAround;
    manager.hour12 = rest.hour12;
    manager.snapToStep = rest.snapToStep;
    manager.wheelControl = rest.wheelControl;
    manager.disallowPartial = rest.disallowPartial;
  });

  onUnmounted(() => manager.remove());

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
