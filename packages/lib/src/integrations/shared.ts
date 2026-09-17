import type { Options, TimescapeManager } from "../index";

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

type DateBindingOptions = {
  controlled: boolean;
  getDate: () => Date | undefined;
  setDate: (date: Date | undefined) => void;
  onDateChange?: (date: Date | null) => void;
};

export const bindDate = (
  manager: TimescapeManager,
  options: DateBindingOptions,
) => {
  let syncing = false;

  const sync = (date: Date | undefined) => {
    syncing = true;
    try {
      manager.date = date;
    } finally {
      syncing = false;
    }
  };

  const unsubscribe = manager.on("changeDate", (date) => {
    if (syncing) return;

    if (!options.controlled) options.setDate(date);
    options.onDateChange?.(date ?? null);
    // Reverts an edit the parent did not accept. The manager ignores the write
    // when it would overwrite an edit in progress, so a cleared segment
    // survives until the parent answers.
    if (options.controlled) sync(options.getDate());
  });

  return { sync, unsubscribe };
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
