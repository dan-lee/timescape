import { beforeEach, describe, expect, it } from "vitest";
import { TimescapeManager } from "../src";
import { createAmPmHandler } from "../src/util";

const createManager = (date?: Date) => {
  const manager = new TimescapeManager(date);
  manager.hour12 = true;
  return manager;
};

describe("createAmPmHandler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("value", () => {
    it("reflects the manager's current period", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      expect(ampm.value).toBe("am");

      manager.date = new Date("2021-01-01T21:00:00");
      expect(ampm.value).toBe("pm");
    });

    it("is undefined when no date is set", () => {
      const ampm = createAmPmHandler(createManager());

      expect(ampm.value).toBeUndefined();
    });
  });

  describe("set", () => {
    it("moves an AM time into PM", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.set("pm");

      expect(manager.ampm).toBe("pm");
      expect(manager.date?.getHours()).toBe(21);
    });

    it("moves a PM time into AM", () => {
      const manager = createManager(new Date("2021-01-01T15:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.set("am");

      expect(manager.ampm).toBe("am");
      expect(manager.date?.getHours()).toBe(3);
    });

    it("keeps the period when set to the current value", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.set("am");

      expect(manager.ampm).toBe("am");
      expect(manager.date?.getHours()).toBe(9);
    });
  });

  describe("toggle", () => {
    it("flips AM to PM", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.toggle();

      expect(manager.ampm).toBe("pm");
      expect(manager.date?.getHours()).toBe(21);
    });

    it("flips PM back to AM", () => {
      const manager = createManager(new Date("2021-01-01T21:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.toggle();

      expect(manager.ampm).toBe("am");
      expect(manager.date?.getHours()).toBe(9);
    });

    it("does nothing when no date is set", () => {
      const manager = createManager();
      const ampm = createAmPmHandler(manager);

      ampm.toggle();

      expect(manager.ampm).toBeUndefined();
      expect(manager.date).toBeUndefined();
    });
  });

  describe("getSelectProps", () => {
    it("exposes the current value", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      expect(ampm.getSelectProps().value).toBe("am");
    });

    it("reads a fresh value on each call", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      expect(ampm.getSelectProps().value).toBe("am");

      manager.date = new Date("2021-01-01T21:00:00");
      expect(ampm.getSelectProps().value).toBe("pm");
    });

    it("updates the manager from a change event", () => {
      const manager = createManager(new Date("2021-01-01T09:00:00"));
      const ampm = createAmPmHandler(manager);

      ampm.getSelectProps().onChange({
        target: { value: "pm" },
      } as unknown as Event);

      expect(manager.ampm).toBe("pm");
      expect(manager.date?.getHours()).toBe(21);
    });
  });
});
