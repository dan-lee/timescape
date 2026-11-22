import { waitFor } from "@testing-library/dom";
import { h, render } from "preact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type DateType, useTimescape } from "../src/integrations/preact";

let container: HTMLDivElement;

beforeEach(() => {
  document.body.innerHTML = "";
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  render(null, container);
});

const Fields = ({ autoFocus }: { autoFocus: (type: DateType) => object }) => {
  const { getRootProps, getInputProps } = useTimescape({
    defaultDate: new Date("2024-03-15T00:00:00.000Z"),
  });

  return h(
    "div",
    getRootProps(),
    (["days", "months"] satisfies DateType[]).map((type) =>
      h("input", {
        key: type,
        "data-testid": type,
        ...getInputProps(type, autoFocus(type)),
      }),
    ),
  );
};

describe("preact", () => {
  it.each([
    ["autoFocus", { autoFocus: true }],
    ["deprecated autofocus", { autofocus: true }],
  ])("focuses the field with %s on mount", async (_, focusProps) => {
    render(
      h(Fields, {
        autoFocus: (type) => (type === "months" ? focusProps : {}),
      }),
      container,
    );

    const months = container.querySelector('[data-testid="months"]');
    await waitFor(() => expect(document.activeElement).toBe(months));
  });
});
