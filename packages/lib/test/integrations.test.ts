import { fireEvent, getByTestId, waitFor } from "@testing-library/dom";
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

  it("keeps legacy date notifications unchanged during an unfinished digit edit", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const onDateChange = vi.fn();
    const onManagerDateChange = vi.fn();
    manager.on("changeDate", onManagerDateChange);
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onDateChange,
    });

    field("years").focus();
    await user.keyboard("2");

    expect(manager.date).toEqual(initialDate);
    expect(onDateChange).not.toHaveBeenCalled();
    expect(onManagerDateChange).not.toHaveBeenCalled();
  });

  it("reports partial and empty edits even while the date stays null", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const onInputChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onInputChange,
    });

    field("days").focus();
    await user.keyboard("{Delete}");
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "partial" });

    field("months").focus();
    await user.keyboard("{Delete}");
    field("years").focus();
    await user.keyboard("{Delete}");
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "empty" });
  });

  it("reports the first partial digit from an empty input", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager();
    const field = register(manager, ["years", "months", "days"]);
    const onInputChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onInputChange,
    });

    field("years").focus();
    await user.keyboard("2");

    expect(onInputChange).toHaveBeenCalledOnce();
    expect(onInputChange).toHaveBeenCalledWith(null, { state: "partial" });
  });

  it("keeps the last cleared field partial until its value is committed", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const onInputChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onInputChange,
    });

    field("years").focus();
    await user.keyboard("{Delete}2");

    expect(manager.date).toBeUndefined();
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "partial" });

    await user.keyboard("026");
    expect(onInputChange).toHaveBeenLastCalledWith(initialDate, {
      state: "complete",
    });
  });

  it("reports partial input with disallowPartial enabled", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(undefined, {
      disallowPartial: true,
    });
    const field = register(manager, ["years", "months", "days"]);
    const onInputChange = vi.fn();
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onInputChange,
    });

    field("years").focus();
    await user.keyboard("2");

    expect(manager.date).toBeUndefined();
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "partial" });
  });
});

describe("blur", () => {
  it("reports blur once focus leaves every input, after committing the edit", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const events: string[] = [];
    manager.on("changeInput", ({ state }) => {
      events.push(state);
    });
    bindDate(manager, {
      controlled: false,
      getDate: () => undefined,
      setDate: vi.fn(),
      onBlur: () => events.push("blur"),
    });

    field("years").focus();
    field("months").focus();
    await new Promise(requestAnimationFrame);
    expect(events).toEqual([]);

    await user.keyboard("1");
    outside.focus();

    await waitFor(() =>
      expect(events).toEqual(["partial", "complete", "blur"]),
    );
  });
  it("commits every pending edit before reporting blur", async () => {
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const events: string[] = [];
    manager.on("changeInput", ({ state }) => {
      events.push(state);
    });
    manager.on("blur", () => {
      events.push("blur");
    });

    // All within one frame, before any focusout commit has run.
    field("years").focus();
    fireEvent.keyDown(field("years"), { key: "1" });
    field("months").focus();
    fireEvent.keyDown(field("months"), { key: "1" });
    outside.focus();

    await waitFor(() => expect(events).toContain("blur"));
    await new Promise(requestAnimationFrame);
    expect(events).toEqual(["partial", "complete", "blur"]);
  });

  it("reports blur once when focus moves through inputs within a frame", async () => {
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const onBlur = vi.fn();
    manager.on("blur", onBlur);

    field("years").focus();
    field("months").focus();
    outside.focus();
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);

    expect(onBlur).toHaveBeenCalledOnce();

    field("days").focus();
    outside.focus();
    await new Promise(requestAnimationFrame);

    expect(onBlur).toHaveBeenCalledTimes(2);
  });
});

describe("external clears", () => {
  it.each([
    ["with a date", initialDate],
    ["without a date", undefined],
  ])("clears an edit in progress %s", async (_, start) => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(start);
    const field = register(manager, ["years", "months", "days"]);
    const states: string[] = [];
    manager.on("changeInput", ({ state }) => {
      states.push(state);
    });

    field("years").focus();
    await user.keyboard("2");
    manager.date = undefined;

    expect(manager.date).toBeUndefined();
    expect(
      (["years", "months", "days"] as const).map((type) => field(type).value),
    ).toEqual(["", "", ""]);
    expect(states.at(-1)).toBe("empty");
  });

  it("restarts digit entry after an external clear", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);

    field("years").focus();
    await user.keyboard("2");
    manager.date = undefined;
    await user.keyboard("2030");

    expect(field("years").value).toBe("2030");
  });

  it("applies a reset after the parent replaced a partial edit", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    let parentDate: Date | undefined = initialDate;
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => parentDate,
      setDate: () => {},
      onInputChange: () => {},
    });

    field("years").focus();
    await user.keyboard("2");
    parentDate = editedDate;
    binding.sync(parentDate);
    parentDate = undefined;
    binding.sync(parentDate);

    expect(manager.date).toBeUndefined();
    expect(
      (["years", "months", "days"] as const).map((type) => field(type).value),
    ).toEqual(["", "", ""]);
  });

  it("keeps an edit in progress when the binding echoes its own clear", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    let current: Date | undefined = initialDate;
    const binding = bindDate(manager, {
      controlled: false,
      getDate: () => current,
      setDate: (date) => {
        current = date;
      },
      onInputChange: vi.fn(),
    });

    field("days").focus();
    await user.keyboard("{Delete}");
    field("years").focus();
    await user.keyboard("2");
    binding.sync(current);

    expect(current).toBeUndefined();
    expect(field("years").value).toBe("0002");
    expect(field("months").value).toBe("01");
    expect(field("days").value).toBe("");
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

  it("empties a partially filled date when the parent clears it", async () => {
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
    field("years").focus();
    await user.keyboard("2030");
    expect(manager.isCompleted()).toBe(false);

    binding.sync(undefined);

    expect(field("years")).toHaveValue("");
    expect(field("months")).toHaveValue("");
    expect(field("days")).toHaveValue("");
    expect(manager.date).toBeUndefined();
  });

  it("keeps a digit edit when the parent echoes its null report", async () => {
    const user = userEvent.setup();
    const manager = new TimescapeManager(initialDate);
    const field = register(manager, ["years", "months", "days"]);
    const binding = bindDate(manager, {
      controlled: true,
      getDate: () => initialDate,
      setDate: () => {},
      onInputChange: () => {},
    });

    field("years").focus();
    await user.keyboard("2");
    binding.sync(undefined);

    expect(field("years")).toHaveValue("0002");
    expect(field("months")).toHaveValue("01");
  });
});
