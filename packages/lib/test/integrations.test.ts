import { describe, expect, it, vi } from "vitest";
import TimescapeManager from "../src";
import { bindDate } from "../src/integrations/shared";

const initialDate = new Date("2026-01-01T00:00:00.000Z");
const editedDate = new Date("2026-02-02T00:00:00.000Z");

describe("integration date binding", () => {
  it("does not report dates synced from the parent", () => {
    const manager = new TimescapeManager(initialDate);
    const onChangeDate = vi.fn();
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => editedDate,
      setDate: vi.fn(),
      onChangeDate,
    });

    binding.sync(editedDate);

    expect(manager.date).toEqual(editedDate);
    expect(onChangeDate).not.toHaveBeenCalled();
  });

  it("restores a controlled date when the parent rejects an edit", () => {
    const manager = new TimescapeManager(initialDate);
    const onChangeDate = vi.fn();
    bindDate(manager, {
      controlled: true,
      getDate: () => initialDate,
      setDate: vi.fn(),
      onChangeDate,
    });

    manager.date = editedDate;

    expect(onChangeDate).toHaveBeenCalledOnce();
    expect(onChangeDate).toHaveBeenCalledWith(editedDate);
    expect(manager.date).toEqual(initialDate);
  });

  it("keeps a controlled date when the parent accepts an edit", () => {
    const manager = new TimescapeManager(initialDate);
    let currentDate = initialDate;
    bindDate(manager, {
      controlled: true,
      getDate: () => currentDate,
      setDate: vi.fn(),
      onChangeDate: (date) => {
        currentDate = date ?? initialDate;
      },
    });

    manager.date = editedDate;

    expect(manager.date).toEqual(editedDate);
  });

  it("updates uncontrolled state and reports the edit", () => {
    const manager = new TimescapeManager(initialDate);
    const setDate = vi.fn();
    const onChangeDate = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => initialDate,
      setDate,
      onChangeDate,
    });

    manager.date = editedDate;

    expect(setDate).toHaveBeenCalledWith(editedDate);
    expect(onChangeDate).toHaveBeenCalledWith(editedDate);
    expect(manager.date).toEqual(editedDate);
  });
});
