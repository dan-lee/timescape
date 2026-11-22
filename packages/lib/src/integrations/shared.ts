import type { InputChangeDetails, Options, TimescapeManager } from "../index";

/**
 * `null` is an empty date, `undefined` is no date at all -- passing `date` as
 * `undefined` leaves the input uncontrolled. Same distinction React Aria and
 * MUI draw for their date fields.
 */
export type DateProp = Date | null | undefined;

export const toDate = (date: DateProp) => date ?? undefined;

export const applyOptions = (
  manager: TimescapeManager,
  options: Omit<Options, "date">,
) => {
  manager.minDate = options.minDate;
  manager.maxDate = options.maxDate;
  manager.hour12 = options.hour12;
  manager.digits = options.digits;
  manager.wrapAround = options.wrapAround;
  manager.snapToStep = options.snapToStep;
  manager.wheelControl = options.wheelControl;
  manager.disallowPartial = options.disallowPartial;
};

export type DateCallbacks = {
  onDateChange?: (date: Date | null) => void;
  onInputChange?: (date: Date | null, details: InputChangeDetails) => void;
  /** Called once focus leaves all of the date's inputs. */
  onBlur?: () => void;
};

type DateBindingOptions = DateCallbacks & {
  controlled: boolean;
  getDate: () => Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export const bindDate = (
  manager: TimescapeManager,
  options: DateBindingOptions,
) => {
  let syncing = false;
  // A replacement date cancels the expected echo of a reported clear.
  let echoFrom: number | undefined;

  const sync = (date: Date | undefined) => {
    if (date === undefined && echoFrom !== undefined) {
      echoFrom = undefined;
      return;
    }
    if (date?.getTime() !== echoFrom) echoFrom = undefined;

    syncing = true;
    try {
      manager.date = date;
    } finally {
      syncing = false;
    }
  };

  const { onDateChange, onInputChange, onBlur } = options;

  const follow = (date: Date | undefined, notify: () => void) => {
    // Capture the parent's value before the callback can change it.
    if (date) echoFrom = undefined;
    else echoFrom ??= options.getDate()?.getTime();

    if (!options.controlled) options.setDate(date);
    notify();
    if (!options.controlled) return;

    // Writing back an unchanged empty value would clear the draft.
    const parentDate = options.getDate();
    if (parentDate?.getTime() !== date?.getTime()) sync(parentDate);
  };

  const unsubscribers = [
    manager.on("changeDate", (date) => {
      if (syncing) return;
      const notify = () => onDateChange?.(date ?? null);
      // Keep legacy notifications when changeInput drives the binding.
      onInputChange ? notify() : follow(date, notify);
    }),
    onInputChange &&
      manager.on("changeInput", ({ date, state }) => {
        if (!syncing)
          follow(date, () => onInputChange(date ?? null, { state }));
      }),
    manager.on("blur", () => onBlur?.()),
  ];

  return {
    sync,
    unsubscribe: () => unsubscribers.forEach((unsubscribe) => unsubscribe?.()),
  };
};

export const warnControlledSwitch = () => {
  // Absent in a browser loading the package unbundled; where a bundler defines
  // it, this lets the warning be stripped in production.
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return;
  }

  console.warn(
    "[timescape] A date input changed from uncontrolled to controlled. " +
      "Decide on one for the lifetime of the input: pass `defaultDate` to keep it uncontrolled, " +
      "or pass `date` from the start and use `null` for the empty value.",
  );
};
