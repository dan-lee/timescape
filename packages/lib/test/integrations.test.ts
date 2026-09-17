import { getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TimescapeManager, { type DateType } from "../src";
import { bindDate } from "../src/integrations/shared";

const initialDate = new Date("2026-01-01T00:00:00.000Z");
const editedDate = new Date("2026-02-02T00:00:00.000Z");

const register = (manager: TimescapeManager, fields: DateType[]) => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div data-testid="root">${fields
      .map((field) => `<input data-testid="${field}" />`)
      .join("")}</div>
  `;

  manager.registerRoot(getByTestId(container, "root"));
  fields.forEach((type) => {
    manager.registerElement(getByTestId(container, type), type);
  });
  document.body.innerHTML = "";
  document.body.appendChild(container);

  return (type: DateType) => getByTestId(container, type) as HTMLInputElement;
};

describe("integration date binding", () => {
  it("does not report dates synced from the parent", () => {
    const manager = new TimescapeManager(initialDate);
    const onDateChange = vi.fn();
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => editedDate,
      setDate: vi.fn(),
      onDateChange,
    });

    binding.sync(editedDate);

    expect(manager.date).toEqual(editedDate);
    expect(onDateChange).not.toHaveBeenCalled();
  });

  it("restores a controlled date when the parent rejects an edit", () => {
    const manager = new TimescapeManager(initialDate);
    const onDateChange = vi.fn();
    bindDate(manager, {
      controlled: true,
      getDate: () => initialDate,
      setDate: vi.fn(),
      onDateChange,
    });

    manager.date = editedDate;

    expect(onDateChange).toHaveBeenCalledOnce();
    expect(onDateChange).toHaveBeenCalledWith(editedDate);
    expect(manager.date).toEqual(initialDate);
  });

  it("keeps a controlled date when the parent accepts an edit", () => {
    const manager = new TimescapeManager(initialDate);
    let currentDate = initialDate;
    bindDate(manager, {
      controlled: true,
      getDate: () => currentDate,
      setDate: vi.fn(),
      onDateChange: (date) => {
        currentDate = date ?? initialDate;
      },
    });

    manager.date = editedDate;

    expect(manager.date).toEqual(editedDate);
  });

  it("updates uncontrolled state and reports the edit", () => {
    const manager = new TimescapeManager(initialDate);
    const setDate = vi.fn();
    const onDateChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => initialDate,
      setDate,
      onDateChange,
    });

    manager.date = editedDate;

    expect(setDate).toHaveBeenCalledWith(editedDate);
    expect(onDateChange).toHaveBeenCalledWith(editedDate);
    expect(manager.date).toEqual(editedDate);
  });

  it("reports an empty date as null", () => {
    const manager = new TimescapeManager(initialDate);
    const onDateChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onDateChange,
    });

    manager.date = undefined;

    expect(onDateChange).toHaveBeenCalledWith(null);
  });
});

describe("controlled editing state", () => {
  // Models a parent that only answers on the next render, which is when the
  // binding's `getDate` still reports the previously rendered date.
  const controlledHarness = (manager: TimescapeManager, start?: Date) => {
    let rendered = start;
    let pending = start;

    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => rendered,
      setDate: () => {},
      onDateChange: (date) => {
        pending = date ?? undefined;
      },
    });
    binding.sync(rendered);

    return {
      render: () => {
        rendered = pending;
        binding.sync(rendered);
      },
      get value() {
        return rendered;
      },
    };
  };

  it("keeps the date a partial entry is based on when a segment is cleared", async () => {
    const user = userEvent.setup();
    const start = new Date("2012-02-29T10:00:00Z");
    const manager = new TimescapeManager(start);
    const field = register(manager, ["years", "months", "days"]);
    const parent = controlledHarness(manager, start);

    field("years").focus();
    await user.keyboard("{Backspace}{Backspace}{Backspace}{Backspace}");
    parent.render();

    expect(parent.value).toBeUndefined();
    expect(manager.date).toBeUndefined();

    await user.keyboard("2012");
    parent.render();

    // Without the previous date the other segments would fall back to today.
    expect(field("months")).toHaveValue("02");
    expect(field("days")).toHaveValue("29");
    expect(manager.date?.getFullYear()).toBe(2012);
  });

  it("applies an external date while a segment is cleared", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(new Date("2024-03-05T00:00:00Z"));
    const field = register(manager, ["years", "months", "days"]);
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => undefined,
      setDate: () => {},
    });

    field("days").focus();
    await user.keyboard("{Delete}");
    expect(field("days")).toHaveValue("");

    binding.sync(new Date("2030-11-22T00:00:00Z"));

    expect(field("years")).toHaveValue("2030");
    expect(field("months")).toHaveValue("11");
    expect(field("days")).toHaveValue("22");
    expect(manager.date).toEqual(new Date("2030-11-22T00:00:00Z"));
  });

  it("empties every segment when the parent clears the date", () => {
    const manager = new TimescapeManager(new Date("2024-03-05T00:00:00Z"));
    const field = register(manager, ["years", "months", "days"]);
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => undefined,
      setDate: () => {},
    });

    binding.sync(undefined);

    expect(field("years")).toHaveValue("");
    expect(field("months")).toHaveValue("");
    expect(field("days")).toHaveValue("");
    expect(manager.date).toBeUndefined();
  });
});
