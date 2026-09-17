import { getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { act, createElement, type ReactNode, useState } from "react";
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
}: {
  date?: Date | null;
  defaultDate?: Date | null;
  onDateChange?: (date: Date | null) => void;
}) => {
  const { getRootProps, getInputProps } = useTimescape({
    date,
    defaultDate,
    onDateChange,
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
