import type TimescapeManager from "../index";

type DateBindingOptions = {
  controlled: boolean;
  getDate: () => Date | undefined;
  setDate: (date: Date | undefined) => void;
  onChangeDate?: (date: Date | undefined) => void;
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
    options.onChangeDate?.(date);
    if (options.controlled) sync(options.getDate());
  });

  return { sync, unsubscribe };
};
