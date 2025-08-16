import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  $NOW,
  type DateType,
  type Options,
  type RangeOptions,
  TimescapeManager,
} from "../index";
import { marry } from "../range";
import { createAmPmHandler } from "../util";

export {
  $NOW,
  type DateType,
  type ReactOptions as Options,
  type ReactRangeOptions as RangeOptions,
};

type ReactOptions = Options & {
  onChangeDate?: (nextDate: Date | undefined) => void;
};

export type UpdateFn = Dispatch<SetStateAction<Options>>;

export const useTimescape = (options: ReactOptions = {}) => {
  const { date, onChangeDate, ...rest } = options;
  const [manager] = useState(() => new TimescapeManager(date, rest));
  const onChangeDateRef = useRef(onChangeDate);
  useLayoutEffect(() => {
    onChangeDateRef.current = onChangeDate;
  }, [onChangeDate]);
  const [optionsState, update] = useState<ReactOptions>(() => ({
    date,
    ...rest,
  }));

  useEffect(() => {
    // this is to work around StrictMode shenanigans
    manager.resync();

    return () => {
      manager.remove();
    };
  }, [manager]);

  useEffect(() => {
    return manager.on("changeDate", (nextDate) => {
      onChangeDateRef.current?.(nextDate);
      update((value) => ({ ...value, date: nextDate }));
    });
  }, [manager]);

  const timestamp = optionsState.date?.getTime();

  useEffect(() => {
    manager.date = timestamp;
    manager.minDate = optionsState.minDate;
    manager.maxDate = optionsState.maxDate;
    manager.hour12 = optionsState.hour12;
    manager.wrapAround = optionsState.wrapAround;
    manager.digits = optionsState.digits;
    manager.snapToStep = optionsState.snapToStep;
    manager.wheelControl = optionsState.wheelControl;
    manager.disallowPartial = optionsState.disallowPartial;
  }, [
    manager,
    timestamp,
    optionsState.minDate,
    optionsState.maxDate,
    optionsState.hour12,
    optionsState.wrapAround,
    optionsState.digits,
    optionsState.snapToStep,
    optionsState.wheelControl,
    optionsState.disallowPartial,
  ]);

  return {
    _manager: manager,
    getInputProps: (
      type: DateType,
      opts?: {
        ref?: MutableRefObject<HTMLInputElement | null>;
        autofocus?: boolean;
      },
    ) => ({
      ref: (element: HTMLInputElement | null) => {
        if (!element) return;
        manager.registerElement(element, type, opts?.autofocus);
        if (opts?.ref) opts.ref.current = element;
      },
    }),
    getRootProps: () => ({
      ref: (element: HTMLElement | null) =>
        element && manager.registerRoot(element),
    }),
    ampm: createAmPmHandler(manager),
    options: optionsState,
    update,
  } as const;
};

export type ReactRangeOptions = RangeOptions & {
  from?: { onChangeDate?: (nextDate: Date | undefined) => void };
  to?: { onChangeDate?: (nextDate: Date | undefined) => void };
};

export const useTimescapeRange = (options: ReactRangeOptions) => {
  const from = useTimescape(options.from);
  const to = useTimescape(options.to);

  useEffect(() => {
    marry(from._manager, to._manager);
  }, [from._manager, to._manager]);

  return {
    getRootProps: () => ({
      ref: (element: HTMLElement | null) => {
        if (!element) return;
        from._manager.registerRoot(element);
        to._manager.registerRoot(element);
      },
    }),
    from: {
      getInputProps: from.getInputProps,
      options: from.options,
      update: from.update,
    },
    to: {
      getInputProps: to.getInputProps,
      options: to.options,
      update: to.update,
    },
  } as const;
};
