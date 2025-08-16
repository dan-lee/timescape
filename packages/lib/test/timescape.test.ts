import {
  fireEvent,
  getByTestId,
  queryByTestId,
  waitFor,
} from "@testing-library/dom";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { PropertySymbol } from "happy-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { type DateType, TimescapeManager, marry } from "../src";

const register = (manager: TimescapeManager, fields: DateType[]) => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div data-testid="root" class="root">${fields
      .map((field) => `<input data-testid="${field}" />`)
      .join("")}</div>
  `;

  manager.registerRoot(getByTestId(container, "root"));
  fields.forEach((type) => {
    manager.registerElement(getByTestId(container, type), type);
  });

  return container;
};

const baseDate = new Date("2021-12-31T23:59:59Z");
let manager: TimescapeManager;
let container: HTMLDivElement;
let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
  document.body.innerHTML = "";
  manager = new TimescapeManager(baseDate);

  // yyyy-mm-dd hh:mm:ss am/pm
  container = register(manager, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
    "am/pm",
  ] satisfies DateType[]);
});

const getFields = () => {
  // biome-ignore lint/style/noNonNullAssertion: test
  const root = queryByTestId<HTMLDivElement>(container, "root")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const years = queryByTestId<HTMLInputElement>(root, "years")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const months = queryByTestId<HTMLInputElement>(root, "months")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const days = queryByTestId<HTMLInputElement>(root, "days")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const hours = queryByTestId<HTMLInputElement>(root, "hours")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const minutes = queryByTestId<HTMLInputElement>(root, "minutes")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const seconds = queryByTestId<HTMLInputElement>(root, "seconds")!;
  // biome-ignore lint/style/noNonNullAssertion: test
  const ampm = queryByTestId<HTMLInputElement>(root, "am/pm")!;

  return { root, years, months, days, hours, minutes, seconds, ampm };
};

describe("timescape", () => {
  describe("rendering", () => {
    it("should render correctly", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      expect(fields.years).toHaveValue("2021");
      expect(fields.months).toHaveValue("12");
      expect(fields.days).toHaveValue("31");
      expect(fields.hours).toHaveValue("23");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.ampm).toHaveValue("PM");
    });

    it("should render correctly with hour12", () => {
      document.body.appendChild(container);

      manager.hour12 = true;
      const fields = getFields();

      expect(fields.years).toHaveValue("2021");
      expect(fields.months).toHaveValue("12");
      expect(fields.days).toHaveValue("31");
      expect(fields.hours).toHaveValue("11");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.ampm).toHaveValue("PM");
    });

    it("should render correctly with digits", () => {
      document.body.appendChild(container);

      manager.digits = "numeric";
      manager.date = new Date("2021-01-01T01:01:01Z");

      const fields = getFields();

      expect(fields.years).toHaveValue("2021");
      expect(fields.months).toHaveValue("1");
      expect(fields.days).toHaveValue("1");
      expect(fields.hours).toHaveValue("1");
      expect(fields.minutes).toHaveValue("01");
      expect(fields.seconds).toHaveValue("01");
      expect(fields.ampm).toHaveValue("AM");
    });

    it("update when date changes", () => {
      document.body.appendChild(container);

      manager.date = new Date("2021-01-21 11:01:21");
      const fields = getFields();

      expect(fields.years).toHaveValue("2021");
      expect(fields.months).toHaveValue("01");
      expect(fields.days).toHaveValue("21");
      expect(fields.hours).toHaveValue("11");
      expect(fields.minutes).toHaveValue("01");
      expect(fields.seconds).toHaveValue("21");
      expect(fields.ampm).toHaveValue("AM");
    });

    it("should render correctly when date is undefined", () => {
      document.body.appendChild(container);

      manager.date = undefined;
      const fields = getFields();

      expect(fields.years).toHaveValue("");
      expect(fields.months).toHaveValue("");
      expect(fields.days).toHaveValue("");
      expect(fields.hours).toHaveValue("");
      expect(fields.minutes).toHaveValue("");
      expect(fields.seconds).toHaveValue("");
      expect(fields.ampm).toHaveValue("");
    });

    it("should focus on click", async () => {
      document.body.appendChild(container);

      const { years } = getFields();
      await user.click(years);

      expect(years).toHaveFocus();
    });

    it("should support autofocus", async () => {
      const container = document.createElement("div");
      container.innerHTML = `
      <div data-testid="root">
        <input data-testid="years" />
      </div>
      `;

      const manager = new TimescapeManager();

      manager.registerRoot(getByTestId(container, "root"));
      manager.registerElement(getByTestId(container, "years"), "years", true);

      document.body.appendChild(container);

      // will only be selected after the next frame
      await waitFor(() => {
        expect(getByTestId(container, "years")).toHaveFocus();
      });
    });

    it("should render placeholders correctly", async () => {
      container = document.createElement("div");
      manager = new TimescapeManager();
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="years" placeholder="YYYY" />
        </div>
      `;
      document.body.appendChild(container);

      const { years } = getFields();

      manager.date = undefined;
      manager.registerRoot(container);
      manager.registerElement(years, "years");

      expect(years).toHaveValue("");
      expect(years).toHaveAttribute("placeholder", "YYYY");
    });

    it("should cleanup correctly", () => {
      document.body.appendChild(container);

      const fields = getFields();

      Object.values(fields).forEach((field) => {
        // @ts-expect-error not public API
        const listeners = field[PropertySymbol.listeners];
        return Object.values(listeners).forEach((l) => {
          expect(l).not.toHaveLength(0);
        });
      });

      manager.remove();

      Object.values(fields).forEach((field) => {
        // @ts-expect-error not public API
        const listeners = field[PropertySymbol.listeners];
        return Object.values(listeners).forEach((l) => {
          expect(l).toHaveLength(0);
        });
      });
    });
  });

  describe("keyboard navigation", () => {
    it("should focus first element by root", () => {
      document.body.appendChild(container);

      const { root, years } = getFields();

      root.focus();
      expect(years).toHaveFocus();
    });

    it("should cycle through fields by Enter key", async () => {
      document.body.appendChild(container);
      const { years, months, days, hours, minutes, seconds, ampm } =
        getFields();

      years.focus();
      expect(years).toHaveFocus();

      const elements = [
        months,
        days,
        hours,
        minutes,
        seconds,
        ampm,
        // start from beginning
        years,
      ];
      for (const element of elements) {
        await user.keyboard("{Enter}");
        expect(element).toHaveFocus();
      }
    });

    it("should cycle through fields by the Tab key", async () => {
      document.body.appendChild(container);
      const { years, months, days, hours, minutes, seconds, ampm } =
        getFields();

      years.focus();
      expect(years).toHaveFocus();

      const elements = [months, days, hours, minutes, seconds, ampm];
      for (const element of elements) {
        await user.tab();
        expect(element).toHaveFocus();
      }
    });

    it("should cycle through fields by arrow keys", async () => {
      document.body.appendChild(container);
      const { years, months, days, hours, minutes, seconds, ampm } =
        getFields();

      years.focus();
      expect(years).toHaveFocus();

      const elements = [
        months,
        days,
        hours,
        minutes,
        seconds,
        ampm,
        // start from beginning
        years,
      ];
      for (const element of elements) {
        await user.keyboard("{ArrowRight}");
        expect(element).toHaveFocus();
      }
    });

    it("should cycle through fields by Tab key in reverse", async () => {
      document.body.appendChild(container);
      const { years, months, days, hours, minutes, seconds, ampm } =
        getFields();

      ampm.focus();
      expect(ampm).toHaveFocus();

      const orderedElements = [seconds, minutes, hours, days, months, years];
      for (const element of orderedElements) {
        await user.tab({ shift: true });
        expect(element).toHaveFocus();
      }
    });

    it("should cycle through fields by arrow keys in reverse", async () => {
      document.body.appendChild(container);
      const { years, months, days, hours, minutes, seconds, ampm } =
        getFields();

      ampm.focus();
      expect(ampm).toHaveFocus();

      const orderedElements = [
        seconds,
        minutes,
        hours,
        days,
        months,
        years,
        // start from end
        ampm,
      ];
      for (const element of orderedElements) {
        await user.keyboard("{ArrowLeft}");
        expect(element).toHaveFocus();
      }
    });

    it("should cycle correctly when adding/removing fields", async () => {
      container = document.createElement("div");
      manager = new TimescapeManager();
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="months" />
        </div>
      `;
      document.body.appendChild(container);

      const { root, months } = getFields();

      manager.registerRoot(root);
      manager.registerElement(months, "months");

      getFields().months.focus();
      expect(months).toHaveFocus();

      const yearInput = document.createElement("input");
      yearInput.setAttribute("data-testid", "years");

      root.prepend(yearInput);
      manager.registerElement(yearInput, "years");

      await user.keyboard("{ArrowLeft}");
      expect(getFields().years).toHaveFocus();

      const daysInput = document.createElement("input");
      daysInput.setAttribute("data-testid", "days");
      root.appendChild(daysInput);

      manager.registerElement(daysInput, "days");

      await user.keyboard("{ArrowLeft}");

      daysInput.remove();

      getFields().years.focus();
      await user.keyboard("{ArrowLeft}");
      expect(getFields().months).toHaveFocus();
    });

    it("should change values with up/down arrow keys", async () => {
      document.body.appendChild(container);
      const fields = getFields();

      // years
      fields.years.focus();
      await user.keyboard("{ArrowUp}");

      expect(fields.years).toHaveValue("2022");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 31 Dec 2022 23:59:59 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.years.value).toMatchInlineSnapshot('"2021"');
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );

      // months
      fields.months.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.months).toHaveValue("01");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Mon, 31 Jan 2022 23:59:59 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.months).toHaveValue("12");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );

      // days
      fields.days.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.days).toHaveValue("01");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 23:59:59 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.days).toHaveValue("31");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );

      // hours
      fields.hours.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.hours).toHaveValue("00");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:59:59 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.hours).toHaveValue("23");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );

      // minutes
      fields.minutes.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.minutes).toHaveValue("00");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:00:59 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.minutes).toHaveValue("59");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );

      // seconds
      fields.seconds.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("00");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Sat, 01 Jan 2022 00:00:00 GMT"',
      );

      await user.keyboard("{ArrowDown}");
      expect(fields.seconds).toHaveValue("59");
      expect(manager.date?.toUTCString()).toMatchInlineSnapshot(
        '"Fri, 31 Dec 2021 23:59:59 GMT"',
      );
    });

    it("should change values with up/down arrow keys in 12-hour mode", async () => {
      document.body.appendChild(container);
      manager.hour12 = true;

      const fields = getFields();

      expect(fields.ampm).toHaveValue("PM");

      fields.seconds.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.hours).toHaveValue("12");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.seconds).toHaveValue("00");
      expect(fields.ampm).toHaveValue("AM");
    });

    it("should change 12-hour mode period value with `p`/`a` keys", async () => {
      document.body.appendChild(container);
      manager.hour12 = true;

      const fields = getFields();

      expect(fields.ampm).toHaveValue("PM");

      fields.ampm.focus();
      await user.keyboard("a");
      expect(fields.ampm).toHaveValue("AM");

      await user.keyboard("p");
      expect(fields.ampm).toHaveValue("PM");

      await user.keyboard("A");
      expect(fields.ampm).toHaveValue("AM");

      await user.keyboard("P");
      expect(fields.ampm).toHaveValue("PM");
    });
  });

  it("should handle wheel events correctly", async () => {
    document.body.appendChild(container);

    manager.wheelControl = true;

    const fields = getFields();

    const initialValue = Number(fields.years.value);
    fields.years.focus();

    for (let i = 0; i < 10; i++) {
      fireEvent.wheel(fields.years, { deltaY: -1 });
    }
    expect(fields.years).toHaveValue(String(initialValue - 10));

    for (let i = 0; i < 10; i++) {
      fireEvent.wheel(fields.years, { deltaY: 1 });
    }
    expect(fields.years).toHaveValue(String(initialValue));
  });

  describe("steps", () => {
    it("should take step into account", async () => {
      container = document.createElement("div");
      manager = new TimescapeManager();
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="minutes" step="15" />
        </div>
      `;
      document.body.appendChild(container);

      const { minutes } = getFields();

      manager.date = new Date("2021-01-01 01:13:43");
      manager.registerRoot(container);
      manager.registerElement(minutes, "minutes");

      minutes.focus();
      await user.keyboard("{ArrowUp}");
      expect(minutes).toHaveValue("28");
    });

    it("should work with snapToStep", async () => {
      container = document.createElement("div");
      manager = new TimescapeManager();
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="hours" step="3" />
          <input data-testid="minutes" step="15" />
          <input data-testid="seconds" step="30" />
        </div>
      `;
      document.body.appendChild(container);

      const { hours, minutes, seconds } = getFields();

      manager.snapToStep = true;
      manager.date = new Date("2021-01-01 01:13:43");
      manager.registerRoot(container);
      manager.registerElement(hours, "hours");
      manager.registerElement(minutes, "minutes");
      manager.registerElement(seconds, "seconds");

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("{ArrowDown}");
      expect(fields.hours).toHaveValue("00");
      await user.keyboard("{ArrowDown}");
      expect(fields.hours).toHaveValue("21");

      fields.minutes.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.minutes).toHaveValue("15");
      await user.keyboard("{ArrowUp}");
      expect(fields.minutes).toHaveValue("30");

      fields.seconds.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("00");
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("30");
    });
  });

  describe("min and max date", () => {
    it("should not allow dates before minDate", async () => {
      document.body.appendChild(container);
      manager.date = new Date("2021-06-06T00:00:00.000Z");
      manager.minDate = new Date("2021-06-06T00:00:00.000Z");

      const fields = getFields();

      fields.seconds.focus();
      await user.keyboard("{ArrowDown}");
      expect(fields.seconds).toHaveValue("00");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.hours).toHaveValue("00");
      expect(fields.days).toHaveValue("06");
      expect(fields.months).toHaveValue("06");
      expect(fields.years).toHaveValue("2021");

      // type in a value
      fields.months.focus();
      await user.keyboard("05");
      expect(fields.days).toHaveFocus();

      expect(fields.seconds).toHaveValue("00");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.hours).toHaveValue("00");
      expect(fields.days).toHaveValue("06");
      expect(fields.months).toHaveValue("06");
      expect(fields.years).toHaveValue("2021");
    });

    it("should not allow dates after maxDate", async () => {
      document.body.appendChild(container);
      manager.date = new Date("2021-06-06T00:00:00.000Z");
      manager.maxDate = new Date("2021-06-06T00:00:00.000Z");

      const fields = getFields();

      fields.seconds.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("00");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.hours).toHaveValue("00");
      expect(fields.days).toHaveValue("06");
      expect(fields.months).toHaveValue("06");
      expect(fields.years).toHaveValue("2021");

      // type in a value
      fields.months.focus();
      await user.keyboard("10");
      expect(fields.days).toHaveFocus();

      expect(fields.seconds).toHaveValue("00");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.hours).toHaveValue("00");
      expect(fields.days).toHaveValue("06");
      expect(fields.months).toHaveValue("06");
      expect(fields.years).toHaveValue("2021");
    });
  });

  describe("wrap around option", () => {
    it("should wrap around seconds", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.seconds.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("00");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.hours).toHaveValue("23");
      expect(fields.days).toHaveValue("31");
      expect(fields.months).toHaveValue("12");
      expect(fields.years).toHaveValue("2021");
    });

    it("should wrap around minutes", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.minutes.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.minutes).toHaveValue("00");
      expect(fields.hours).toHaveValue("23");
      expect(fields.days).toHaveValue("31");
      expect(fields.months).toHaveValue("12");
      expect(fields.years).toHaveValue("2021");
    });

    it("should wrap around hours", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.hours).toHaveValue("00");
      expect(fields.days).toHaveValue("31");
      expect(fields.months).toHaveValue("12");
      expect(fields.years).toHaveValue("2021");
    });

    it("should wrap around days", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.days.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.hours).toHaveValue("23");
      expect(fields.days).toHaveValue("01");
      expect(fields.months).toHaveValue("12");
      expect(fields.years).toHaveValue("2021");
    });

    it("should wrap around months", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.months.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.hours).toHaveValue("23");
      expect(fields.days).toHaveValue("31");
      expect(fields.months).toHaveValue("01");
      expect(fields.years).toHaveValue("2021");
    });

    it("should wrap correctly with 12-hour mode", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;
      manager.hour12 = true;

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.seconds).toHaveValue("59");
      expect(fields.minutes).toHaveValue("59");
      expect(fields.hours).toHaveValue("12");
      expect(fields.days).toHaveValue("31");
      expect(fields.months).toHaveValue("12");
      expect(fields.years).toHaveValue("2021");
      expect(fields.ampm).toHaveValue("AM");
    });

    it("should do nothing for years and ampm", async () => {
      document.body.appendChild(container);
      manager.wrapAround = true;

      const fields = getFields();

      fields.years.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.years).toHaveValue("2022");

      fields.ampm.focus();
      await user.keyboard("{ArrowUp}");
      expect(fields.ampm).toHaveValue("AM");
    });
  });

  describe("manual typing", () => {
    it("should work with seconds", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.seconds.focus();
      await user.keyboard("1");
      expect(fields.seconds).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.seconds).toHaveValue("19");

      // when value entered bigger than '5', it will focus next field
      fields.seconds.focus();
      await user.keyboard("7");
      expect(fields.seconds).toHaveValue("07");
      expect(fields.ampm).toHaveFocus();
    });

    it("should work with minutes", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.minutes.focus();
      await user.keyboard("1");
      expect(fields.minutes).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.minutes).toHaveValue("19");

      // when value entered bigger than '5', it will focus next field
      fields.minutes.focus();
      await user.keyboard("7");
      expect(fields.minutes).toHaveValue("07");
      expect(fields.seconds).toHaveFocus();
    });

    it("should work with hours", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("1");
      expect(fields.hours).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.hours).toHaveValue("19");

      // when value entered bigger than '2', it will focus next field
      fields.hours.focus();
      await user.keyboard("3");
      expect(fields.hours).toHaveValue("03");
      expect(fields.minutes).toHaveFocus();
    });

    it("should work with manual typing in 12-hour mode", async () => {
      document.body.appendChild(container);
      manager.hour12 = true;

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("1");
      expect(fields.hours).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.hours).toHaveValue("09");

      // when value 12 entered, it should change AM/PM
      fields.hours.focus();
      await user.keyboard("12");
      expect(fields.hours).toHaveValue("12");
      expect(fields.ampm).toHaveValue("PM");

      // when value entered bigger than '1', it will focus next field
      fields.hours.focus();
      await user.keyboard("2");
      expect(fields.hours).toHaveValue("02");
      expect(fields.minutes).toHaveFocus();
    });

    it("should remain PM", async () => {
      document.body.appendChild(container);
      manager.hour12 = true;

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("5");
      expect(fields.ampm).toHaveValue("PM");

      fields.hours.focus();
      await user.keyboard("12");
      expect(fields.hours).toHaveValue("12");
      expect(fields.ampm).toHaveValue("PM");
    });

    it("should remain AM", async () => {
      document.body.appendChild(container);
      manager.date = new Date("2021-01-01T03:00:00Z");
      manager.hour12 = true;

      const fields = getFields();

      fields.hours.focus();
      await user.keyboard("5");
      expect(fields.ampm).toHaveValue("AM");

      fields.hours.focus();
      await user.keyboard("12");
      expect(fields.hours).toHaveValue("12");
      expect(fields.ampm).toHaveValue("AM");
    });

    it("should work with days", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.days.focus();
      await user.keyboard("1");
      expect(fields.days).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.days).toHaveValue("19");

      // when value entered bigger than '3', it will focus next field
      fields.days.focus();
      await user.keyboard("4");
      expect(fields.days).toHaveValue("04");
      expect(fields.hours).toHaveFocus();
    });

    it("should work with days and take max days in month into account", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.days.focus();
      await user.keyboard("3");
      expect(fields.days).toHaveValue("03");

      await user.keyboard("2");
      expect(fields.days).toHaveValue("31");

      manager.date = new Date(2021, 1, 1);
      fields.days.focus();
      await user.keyboard("2");
      expect(fields.days).toHaveValue("02");

      await user.keyboard("9");
      expect(fields.days).toHaveValue("28");
    });

    it("should work with months", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.months.focus();
      await user.keyboard("1");
      expect(fields.months).toHaveValue("01");

      await user.keyboard("9");
      expect(fields.months).toHaveValue("12");

      // when value entered bigger than '1', it will focus next field
      fields.months.focus();
      await user.keyboard("2");
      expect(fields.months).toHaveValue("02");
      expect(fields.days).toHaveFocus();
    });

    it("should work with years", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.years.focus();
      await user.keyboard("2");
      expect(fields.years).toHaveValue("0002");

      await user.keyboard("0");
      expect(fields.years).toHaveValue("0020");

      await user.keyboard("2");
      expect(fields.years).toHaveValue("0202");

      await user.keyboard("0");
      expect(fields.years).toHaveValue("2020");

      expect(fields.months).toHaveFocus();
    });

    it("should work with single digits", async () => {
      document.body.appendChild(container);

      manager.digits = "numeric";
      const fields = getFields();

      fields.days.focus();
      await user.keyboard("9{ArrowRight}");
      expect(fields.days).toHaveValue("9");
    });

    it("should allow up/down keys when there is an intermediate value", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.minutes.focus();
      await user.keyboard("3{ArrowUp}");
      expect(fields.minutes).toHaveValue("04");

      fields.months.focus();
      await user.keyboard("1{ArrowDown}");

      expect(fields.months).toHaveValue("12");
    });

    it("should set value to intermediate value when focus is lost", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.minutes.focus();
      await user.keyboard("3");
      fields.hours.focus();
      expect(fields.minutes).toHaveValue("03");
    });
  });

  describe("partial input", () => {
    it("should allow partial input", async () => {
      manager = new TimescapeManager();

      container = register(manager, ["years", "months", "days", "am/pm"]);
      document.body.appendChild(container);

      expect(manager.date).toBeUndefined();
      const fields = getFields();

      fields.years.focus();
      await user.keyboard("{ArrowUp}");

      const now = new Date();

      expect(fields.years).toHaveValue(String(now.getFullYear()));
      expect(fields.months).toHaveValue("");
      expect(manager.date).toBeUndefined();

      fields.months.focus();
      await user.keyboard("{ArrowUp}");

      expect(fields.months).toHaveValue(
        String(now.getMonth() + 1).padStart(2, "0"),
      );

      fields.days.focus();
      await user.keyboard("{ArrowUp}");

      expect(fields.days).toHaveValue(String(now.getDate()).padStart(2, "0"));

      fields.ampm.focus();
      await user.keyboard("{ArrowUp}");

      expect(fields.ampm).toHaveValue(now.getHours() < 12 ? "AM" : "PM");

      expect(manager.date).not.toBeUndefined();
    });

    it("should allow to clear individual segments", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.years.focus();
      await user.keyboard("{Delete}");

      expect(fields.years).toHaveValue("");
      expect(manager.date).toBeUndefined();
    });

    it("should handle backspace by deleting character by character", async () => {
      document.body.appendChild(container);

      const fields = getFields();

      fields.years.focus();

      await user.keyboard("{Backspace}");
      expect(fields.years).toHaveValue("0202");

      await user.keyboard("{Backspace}");
      expect(fields.years).toHaveValue("0020");

      await user.keyboard("{Backspace}");
      expect(fields.years).toHaveValue("0002");

      await user.keyboard("{Backspace}");
      expect(fields.years).toHaveValue("");

      expect(manager.date).toBeUndefined();
    });

    it("should work with partial input disabled", async () => {
      const now = new Date();
      manager = new TimescapeManager(now, {
        disallowPartial: true,
      });

      container = register(manager, ["years", "months", "days"]);
      document.body.appendChild(container);

      const fields = getFields();

      fields.years.focus();
      await user.keyboard("{Delete}");

      expect(manager.date).toStrictEqual(now);
    });
  });

  it("should support setting options on constructor", () => {
    const container = document.createElement("div");
    new TimescapeManager(baseDate, {
      digits: "numeric",
      hour12: true,
      wrapAround: true,
      maxDate: new Date(2024, 0, 1),
      minDate: new Date(2020, 0, 1),
    });

    document.body.appendChild(container);
  });

  it("should not focus initial field when root is clicked while other field is focused", async () => {
    document.body.appendChild(container);

    const { root, years, months } = getFields();

    // root needs focus event to be triggered
    root.focus();

    expect(years).toHaveFocus();

    await user.click(months);
    expect(months).toHaveFocus();

    root.focus();
    expect(months).toHaveFocus();
  });

  it("should allow to tab out", async () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div data-testid="root">
        <input data-testid="years" />
      </div>
    `;
    const yearsField = getByTestId<HTMLInputElement>(container, "years");

    const manager = new TimescapeManager();

    manager.registerRoot(getByTestId(container, "root"));
    manager.registerElement(yearsField, "years", true);

    document.body.appendChild(container);

    yearsField.focus();

    await user.tab();
    expect(document.body).toHaveFocus();

    yearsField.focus();

    await user.tab({ shift: true });
    expect(document.body).toHaveFocus();
  });

  describe("ranges", () => {
    beforeEach(() => {
      container.innerHTML = `
        <div data-testid="root">
          <input data-testid="from-years" />
          <input data-testid="to-years" />
        </div>
      `;

      const fromManager = new TimescapeManager(new Date("2024"));
      const toManager = new TimescapeManager(new Date("2025"));

      const root = getByTestId(container, "root");

      marry(fromManager, toManager);

      fromManager.registerRoot(root);
      toManager.registerRoot(root);

      fromManager.registerElement(
        getByTestId(container, "from-years"),
        "years",
      );
      toManager.registerElement(getByTestId(container, "to-years"), "years");

      document.body.appendChild(container);
    });

    it("should wrap range input focus", async () => {
      getByTestId(container, "from-years").focus();
      await user.keyboard("{ArrowLeft}");
      expect(getByTestId(container, "to-years")).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(getByTestId(container, "from-years")).toHaveFocus();
    });

    it("should not allow to set from date after to date", async () => {
      getByTestId(container, "from-years").focus();
      await user.keyboard("{ArrowUp}");
      await user.keyboard("{ArrowUp}");
      expect(getByTestId(container, "to-years")).toHaveValue("2025");
    });

    it("should not allow to set to date before from date", async () => {
      getByTestId(container, "to-years").focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      expect(getByTestId(container, "from-years")).toHaveValue("2024");
    });
  });

  describe("milliseconds field", () => {
    beforeEach(() => {
      // Create a new container with milliseconds field
      container = register(manager, [
        "hours",
        "minutes",
        "seconds",
        "milliseconds",
      ] satisfies DateType[]);
    });

    it("should render milliseconds correctly", () => {
      document.body.appendChild(container);

      const milliseconds = queryByTestId<HTMLInputElement>(
        container,
        "milliseconds",
      );
      expect(milliseconds).toHaveValue("000");
    });

    it("should handle manual typing in milliseconds", async () => {
      document.body.appendChild(container);

      const milliseconds = queryByTestId<HTMLInputElement>(
        container,
        "milliseconds",
      );

      milliseconds?.focus();
      await user.keyboard("1");
      expect(milliseconds).toHaveValue("001");

      await user.keyboard("2");
      expect(milliseconds).toHaveValue("012");

      await user.keyboard("3");
      expect(milliseconds).toHaveValue("123");

      // Should handle 3-digit input
      milliseconds?.focus();
      milliseconds?.select();
      await user.keyboard("999");
      expect(milliseconds).toHaveValue("999");
    });

    it("should handle arrow keys for milliseconds", async () => {
      document.body.appendChild(container);

      const milliseconds = queryByTestId<HTMLInputElement>(
        container,
        "milliseconds",
      );

      milliseconds?.focus();
      await user.keyboard("{ArrowUp}");
      expect(milliseconds).toHaveValue("001");

      await user.keyboard("{ArrowDown}");
      expect(milliseconds).toHaveValue("000");

      milliseconds?.select();
      await user.keyboard("999");
      await user.keyboard("{ArrowUp}");
      expect(milliseconds).toHaveValue("000");

      await user.keyboard("{ArrowDown}");
      expect(milliseconds).toHaveValue("999");
    });

    it("should handle milliseconds with different date objects", () => {
      const testDate = new Date("2024-01-15T14:30:45.678Z");
      manager.date = testDate;
      document.body.appendChild(container);

      const milliseconds = queryByTestId<HTMLInputElement>(
        container,
        "milliseconds",
      );
      expect(milliseconds).toHaveValue("678");
    });

    it("should update date object when milliseconds change", async () => {
      document.body.appendChild(container);

      const milliseconds = queryByTestId<HTMLInputElement>(
        container,
        "milliseconds",
      );

      milliseconds?.focus();
      milliseconds?.select();
      await user.keyboard("456");

      expect(manager.date?.getMilliseconds()).toBe(456);
    });
  });
});
