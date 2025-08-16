import {
  type ComponentPublicInstance,
  onUnmounted,
  ref,
  watchEffect,
} from "vue";

import {
  $NOW,
  type DateType,
  type Options,
  type RangeOptions,
  TimescapeManager,
} from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export { $NOW, type DateType, type Options, type RangeOptions };

export const useTimescape = (options: Options = {}) => {
  const optionsRef = ref(options);
  const { date, ...rest } = options;

  const manager = new TimescapeManager(date, rest);

  manager.on("changeDate", (nextDate) => {
    optionsRef.value.date = nextDate;
  });

  watchEffect(() => {
    manager.date = optionsRef.value.date;
    manager.minDate = optionsRef.value.minDate;
    manager.maxDate = optionsRef.value.maxDate;
    manager.digits = optionsRef.value.digits;
    manager.wrapAround = optionsRef.value.wrapAround;
    manager.hour12 = optionsRef.value.hour12;
    manager.snapToStep = optionsRef.value.snapToStep;
    manager.wheelControl = optionsRef.value.wheelControl;
    manager.disallowPartial = optionsRef.value.disallowPartial;
  });

  onUnmounted(() => manager.remove());

  return {
    _manager: manager,
    registerElement:
      (type: DateType) => (element: Element | ComponentPublicInstance | null) =>
        element instanceof HTMLInputElement &&
        manager.registerElement(element, type),
    registerRoot: () => (element: Element | ComponentPublicInstance | null) => {
      element instanceof HTMLElement && manager.registerRoot(element);
    },
    ampm: createAmPmHandler(manager),
    options: optionsRef,
  } as const;
};

export const useTimescapeRange = (options: RangeOptions = {}) => {
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
    from: {
      registerElement: from.registerElement,
      options: from.options,
    },
    to: {
      registerElement: to.registerElement,
      options: to.options,
    },
  } as const;
};
