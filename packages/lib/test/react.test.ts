import { getByTestId, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
  act,
  createElement,
  createRef,
  type ReactNode,
  type RefCallback,
  useState,
} from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimescape } from "../src/integrations/react";

const initialDate = new Date("2024-03-15T00:00:00.000Z");

let container: HTMLDivElement;
let root: Root;
let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  user = userEvent.setup();
  document.body.innerHTML = "";
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
});

const Fields = ({
  date,
  defaultDate,
  onDateChange,
  onInputChange,
}: {
  date?: Date | null;
  defaultDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
  onInputChange?: (
    date: Date | null,
    details: { state: "empty" | "partial" | "complete" },
  ) => void;
}) => {
  const { getRootProps, getInputProps } = useTimescape({
    date,
    defaultDate,
    onDateChange,
    onInputChange,
  });

  return createElement(
    "div",
    { ...getRootProps(), "data-testid": "root" },
    createElement("input", {
      ...getInputProps("years"),
      "data-testid": "years",
    }),
    createElement("input", {
      ...getInputProps("months"),
      "data-testid": "months",
    }),
    createElement("input", { ...getInputProps("days"), "data-testid": "days" }),
  );
};

const render = (element: ReactNode) => act(async () => root.render(element));

const field = (type: string) =>
  getByTestId(container, type) as HTMLInputElement;

describe("react integration", () => {
  it("returns declarative input attributes and native accessible labels", async () => {
    const LabelledFields = () => {
      const { getRootProps, getInputProps } = useTimescape();

      return createElement(
        "div",
        { ...getRootProps(), "data-testid": "root" },
        createElement("input", {
          ...getInputProps("days"),
          "aria-label": "Tag",
          "data-testid": "days",
        }),
      );
    };

    await render(createElement(LabelledFields));

    expect(getByTestId(container, "root")).toHaveAttribute("role", "group");
    expect(field("days")).toHaveAttribute("role", "spinbutton");
    expect(field("days")).toHaveAttribute("inputmode", "numeric");
    expect(field("days")).toHaveAttribute("autocomplete", "off");
    expect(field("days")).toHaveAttribute("aria-label", "Tag");
    expect(field("days")).toHaveAttribute("placeholder", "dd");
  });

  it("preserves consumer-provided accessible names", async () => {
    const LabelledField = () => {
      const { getRootProps, getInputProps } = useTimescape({
        defaultDate: initialDate,
      });
      return createElement(
        "div",
        getRootProps(),
        createElement("span", { id: "day-label" }, "Day of month"),
        createElement("input", {
          ...getInputProps("days"),
          "aria-label": undefined,
          "aria-labelledby": "day-label",
          "data-testid": "days",
        }),
      );
    };

    await render(createElement(LabelledField));

    expect(field("days")).not.toHaveAttribute("aria-label");
    expect(field("days")).toHaveAttribute("aria-labelledby", "day-label");
  });

  it("composes callback and object refs, including cleanup", async () => {
    const callbackSpy = vi.fn();
    const callbackRef: RefCallback<HTMLInputElement> = (element) =>
      callbackSpy(element);
    const objectRef = createRef<HTMLInputElement>();

    const Refs = () => {
      const { getRootProps, getInputProps } = useTimescape();
      return createElement(
        "div",
        getRootProps(),
        createElement("input", {
          ...getInputProps("days", { ref: callbackRef }),
          "data-testid": "days",
        }),
        createElement("input", {
          ...getInputProps("months", { ref: objectRef }),
          "data-testid": "months",
        }),
      );
    };

    await render(createElement(Refs));
    expect(callbackSpy).toHaveBeenCalledWith(field("days"));
    expect(objectRef.current).toBe(field("months"));

    await render(null);
    expect(callbackSpy).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).toBeNull();
  });

  it("composes a root ref and reports blur when focus leaves the group", async () => {
    let rootElement: HTMLElement | null = null;
    const onBlur = vi.fn();

    const FormField = () => {
      const { getRootProps, getInputProps } = useTimescape({ onBlur });
      return createElement(
        "div",
        null,
        createElement(
          "div",
          getRootProps({
            ref: (element) => {
              rootElement = element;
            },
          }),
          createElement("input", {
            ...getInputProps("months"),
            "data-testid": "months",
          }),
          createElement("input", {
            ...getInputProps("days"),
            "data-testid": "days",
          }),
        ),
        createElement("button", { type: "button", "data-testid": "outside" }),
      );
    };

    await render(createElement(FormField));

    await act(async () => rootElement?.focus());
    expect(field("months")).toHaveFocus();

    await act(async () => user.tab());
    expect(field("days")).toHaveFocus();
    await act(async () => new Promise(requestAnimationFrame));
    expect(onBlur).not.toHaveBeenCalled();

    await act(async () => user.tab());
    expect(getByTestId(container, "outside")).toHaveFocus();
    await waitFor(() => expect(onBlur).toHaveBeenCalledOnce());
  });

  it("runs cleanups returned from callback refs", async () => {
    const calls: string[] = [];
    const track =
      (name: string) =>
      (element: HTMLElement | null): (() => void) | undefined => {
        if (!element) {
          calls.push(`${name}:null`);
          return undefined;
        }
        calls.push(`${name}:mount`);
        return () => calls.push(`${name}:cleanup`);
      };
    let rerender = () => {};

    const RefFields = () => {
      const [, setCount] = useState(0);
      rerender = () => setCount((count) => count + 1);
      const { getRootProps, getInputProps } = useTimescape();
      return createElement(
        "div",
        getRootProps({ ref: track("root") }),
        createElement("input", getInputProps("days", { ref: track("days") })),
      );
    };

    await render(createElement(RefFields));
    await act(async () => rerender());
    await act(async () => root.unmount());
    root = createRoot(container);

    expect(calls).toEqual([
      "days:mount",
      "root:mount",
      "days:cleanup",
      "root:cleanup",
      "days:mount",
      "root:mount",
      "root:cleanup",
      "days:cleanup",
    ]);
  });

  it("supports autoFocus and focusing a named field", async () => {
    let focusDays = () => {};
    const FocusableFields = () => {
      const { getRootProps, getInputProps, focusField } = useTimescape();
      focusDays = () => focusField("days");
      return createElement(
        "div",
        getRootProps(),
        createElement("input", {
          ...getInputProps("months", { autoFocus: true }),
          "data-testid": "months",
        }),
        createElement("input", {
          ...getInputProps("days"),
          "data-testid": "days",
        }),
      );
    };

    await render(createElement(FocusableFields));
    await waitFor(() => expect(field("months")).toHaveFocus());

    focusDays();
    expect(field("days")).toHaveFocus();
  });

  it("reports partial and empty edits without reactive hook state", async () => {
    const onInputChange = vi.fn();
    await render(
      createElement(Fields, { defaultDate: initialDate, onInputChange }),
    );

    field("days").focus();
    await act(async () => user.keyboard("{Delete}"));
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "partial" });

    field("months").focus();
    await act(async () => user.keyboard("{Delete}"));
    field("years").focus();
    await act(async () => user.keyboard("{Delete}"));
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "empty" });
  });

  it("keeps the first digit of a controlled field that starts empty", async () => {
    const Parent = () => {
      const [date, setDate] = useState<Date | null>(null);
      return createElement(Fields, {
        date,
        onInputChange: (nextDate) => setDate(nextDate),
      });
    };

    await render(createElement(Parent));
    field("years").focus();
    await act(async () => user.keyboard("2"));

    expect(field("years")).toHaveValue("0002");
  });

  it("keeps a draft in a controlled date loaded after mount", async () => {
    let load = (_date: Date) => {};
    const Parent = () => {
      const [date, setDate] = useState<Date | null>(null);
      load = setDate;
      return createElement(Fields, {
        date,
        onInputChange: (nextDate) => setDate(nextDate),
      });
    };

    await render(createElement(Parent));
    await act(async () => load(initialDate));
    field("years").focus();
    await act(async () => user.keyboard("2"));

    expect(field("years")).toHaveValue("0002");
    expect(field("months")).toHaveValue("03");
    expect(field("days")).toHaveValue("15");
  });

  it("does not expose a stale controlled date while a segment is being replaced", async () => {
    let formDate: Date | null = initialDate;
    const onDateChange = vi.fn();
    const onInputChange = vi.fn();

    const Parent = () => {
      const [date, setDate] = useState<Date | null>(initialDate);
      formDate = date;
      return createElement(Fields, {
        date,
        onDateChange,
        onInputChange: (nextDate, details) => {
          onInputChange(nextDate, details);
          setDate(nextDate);
        },
      });
    };

    await render(createElement(Parent));
    field("years").focus();
    await act(async () => user.keyboard("2"));

    expect(formDate).toBeNull();
    expect(onDateChange).not.toHaveBeenCalled();
    expect(onInputChange).toHaveBeenLastCalledWith(null, { state: "partial" });
    expect(field("years")).toHaveValue("0002");

    await act(async () => user.keyboard("030"));
    expect(formDate?.getFullYear()).toBe(2030);
    expect(onInputChange).toHaveBeenLastCalledWith(formDate, {
      state: "complete",
    });
  });

  it("does not report a transient partial state for a single-digit edit", async () => {
    const onInputChange = vi.fn();
    await render(
      createElement(Fields, { defaultDate: initialDate, onInputChange }),
    );

    field("days").focus();
    await act(async () => user.keyboard("4"));

    expect(onInputChange).toHaveBeenCalledOnce();
    expect(onInputChange).toHaveBeenCalledWith(expect.any(Date), {
      state: "complete",
    });
  });

  it("stays controlled after the date is cleared", async () => {
    const rejected: Array<Date | null> = [];

    // A parent holding `Date | undefined` instead of `null` -- the shape 0.8
    // used. Clearing must not silently hand control back to the input.
    const Parent = () => {
      const [date, setDate] = useState<Date | undefined>(initialDate);
      return createElement(Fields, {
        date,
        onDateChange: (next) => {
          if (next === null) setDate(undefined);
          else rejected.push(next);
        },
      });
    };

    await render(createElement(Parent));

    field("years").focus();
    await act(async () => {
      await user.keyboard("{Delete}");
    });
    expect(field("years")).toHaveValue("");

    // Now the input is controlled with an empty date. An edit the parent does
    // not accept has to be reverted, which only happens while controlled.
    await act(async () => {
      await user.keyboard("2012");
    });

    expect(rejected).not.toHaveLength(0);
    expect(field("years")).toHaveValue("");
  });

  it("keeps the previous date context when a segment is cleared", async () => {
    const Parent = () => {
      const [date, setDate] = useState<Date | null>(initialDate);
      return createElement(Fields, { date, onDateChange: setDate });
    };

    await render(createElement(Parent));

    field("years").focus();
    await act(async () => {
      await user.keyboard("{Delete}");
    });
    await act(async () => {
      await user.keyboard("2012");
    });

    expect(field("months")).toHaveValue("03");
    expect(field("days")).toHaveValue("15");
  });

  it("reverts an edit the parent rejects", async () => {
    await render(
      createElement(Fields, { date: initialDate, onDateChange: () => {} }),
    );

    field("days").focus();
    await act(async () => {
      await user.keyboard("21");
    });

    expect(field("days")).toHaveValue("15");
  });

  it("applies a date pushed from the parent", async () => {
    let push: (date: Date | null) => void = () => {};

    const Parent = () => {
      const [date, setDate] = useState<Date | null>(initialDate);
      push = setDate;
      return createElement(Fields, { date, onDateChange: setDate });
    };

    await render(createElement(Parent));

    await act(async () => push(new Date("2030-11-22T00:00:00.000Z")));

    expect(field("years")).toHaveValue("2030");
    expect(field("months")).toHaveValue("11");
    expect(field("days")).toHaveValue("22");
  });

  it("keeps its own state when uncontrolled", async () => {
    const onDateChange = vi.fn();
    await render(
      createElement(Fields, { defaultDate: initialDate, onDateChange }),
    );

    field("days").focus();
    await act(async () => {
      await user.keyboard("21");
    });

    expect(field("days")).toHaveValue("21");
    expect(onDateChange).toHaveBeenCalled();
  });

  it("reacts to options changing after mount", async () => {
    const Clock = ({ hour12 }: { hour12: boolean }) => {
      const { getRootProps, getInputProps } = useTimescape({
        date: new Date("2024-03-15T14:30:00.000Z"),
        hour12,
      });

      return createElement(
        "div",
        { ...getRootProps(), "data-testid": "root" },
        createElement("input", {
          ...getInputProps("hours"),
          "data-testid": "hours",
        }),
        createElement("input", {
          ...getInputProps("am/pm"),
          "data-testid": "am/pm",
        }),
      );
    };

    await render(createElement(Clock, { hour12: false }));
    expect(field("hours")).toHaveValue("14");

    await render(createElement(Clock, { hour12: true }));
    expect(field("hours")).toHaveValue("02");
    expect(field("am/pm")).toHaveValue("PM");
  });

  it("warns when an uncontrolled input becomes controlled", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await render(createElement(Fields, { defaultDate: initialDate }));
    await render(createElement(Fields, { date: initialDate }));

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("uncontrolled to controlled"),
    );
    warn.mockRestore();
  });
});
