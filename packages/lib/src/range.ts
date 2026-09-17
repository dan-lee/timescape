import type { TimescapeManager } from "./index";

/**
 * Keeps two managers in a from/to relationship: focus wraps from one into the
 * other, and neither end can cross the other.
 * @returns a function that dissolves the relationship again
 */
export const marry = (from: TimescapeManager, to: TimescapeManager) => {
  const unsubscribers = [
    from.on("focusWrap", (type) => to.focusField(type === "start" ? -1 : 0)),
    from.on("changeDate", (date) => to.setRangeBound("min", date)),
    to.on("focusWrap", (type) => from.focusField(type === "end" ? 0 : -1)),
    to.on("changeDate", (date) => from.setRangeBound("max", date)),
  ];

  if (from.date) to.setRangeBound("min", from.date);
  if (to.date) from.setRangeBound("max", to.date);

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    to.setRangeBound("min", undefined);
    from.setRangeBound("max", undefined);
  };
};
