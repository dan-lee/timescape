import type { TimescapeManager } from "./index";

export const marry = (from: TimescapeManager, to: TimescapeManager) => {
  from.on("focusWrap", (type) => to.focusField(type === "start" ? -1 : 0));
  from.on("changeDate", (date) => {
    if (!date) return;
    to.minDate = date;
  });

  to.on("focusWrap", (type) => from.focusField(type === "end" ? 0 : -1));
  to.on("changeDate", (date) => {
    if (!date) return;
    from.maxDate = date;
  });

  if (from.date) to.minDate = from.date;
  if (to.date) from.maxDate = to.date;
};
