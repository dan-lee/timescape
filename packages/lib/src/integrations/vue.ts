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

  // Programmatic writes to `manager.date` (syncing the source, or snapping
  // back in controlled mode) emit `changeDate` too. This flag lets us ignore
  // those echoes so `onChangeDate` only fires for genuine user edits.
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
      // Snap back to the controlled value; the parent must update `date`
      // to accept the change.
      applyDate(currentDate.value);
    } else {
      internalDate.value = nextDate;
      onChangeDate?.(nextDate);
    }
  });

  watch(currentDate, (newDate) => applyDate(newDate));

  // Reading `options` (rather than a destructured copy) keeps these reactive
  // when a reactive options object is passed.
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
