import type TimescapeManager from "../index";

/**
 * `null` is an empty value, `undefined` is no value at all: passing `date`
 * as `undefined` means "this input is uncontrolled", the same distinction
 * React Aria and MUI draw for their date fields.
 */
export type DateProp = Date | null | undefined;

export const toDate = (date: DateProp) => date ?? undefined;

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
    // Writing the current date back is what reverts an edit the parent did not
    // accept. The manager ignores it when it would overwrite an edit in
    // progress, so a cleared segment survives until the parent answers.
    if (options.controlled) sync(options.getDate());
  });

  return { sync, unsubscribe };
};

// Declared locally so the package does not need node types; the `typeof` guard
// below keeps it safe in browsers, and bundlers can still strip the warning.
declare const process: { env?: { NODE_ENV?: string } } | undefined;

export const warnControlledSwitch = () => {
  if (
    typeof process !== "undefined" &&
    process?.env?.NODE_ENV === "production"
  ) {
    return;
  }

  console.warn(
    "[timescape] A date input changed from uncontrolled to controlled. " +
      "Decide on one for the lifetime of the input: pass `defaultDate` to keep it uncontrolled, " +
      "or pass `date` from the start and use `null` for the empty value.",
  );
};
