import {
  add,
  daysInMonth,
  format,
  get,
  isSameSeconds,
  set,
  toggleAmPm,
} from "./date";
import {
  type Callback,
  addElementListener,
  createPubSub,
  isTouchDevice,
} from "./util";

export { marry } from "./range";

export type DateType =
  | "days"
  | "months"
  | "years"
  | "hours"
  | "minutes"
  | "seconds"
  | "milliseconds"
  | "am/pm";

type RegistryEntry = {
  type: DateType;
  inputElement: HTMLInputElement;
  shadowElement: HTMLSpanElement;
  intermediateValue: string;
  autofocus?: boolean;
  isUnset: boolean;
  listeners: Array<() => void>;
};
type Registry = Map<DateType, RegistryEntry>;

export const $NOW = "$NOW" as const;
export type $NOW = typeof $NOW;

export { STOP_EVENT_PROPAGATION } from "./util";

export type Options = {
  date?: Date;
  minDate?: Date | $NOW;
  maxDate?: Date | $NOW;
  hour12?: boolean;
  digits?: "numeric" | "2-digit";
  wrapAround?: boolean;
  snapToStep?: boolean;
  wheelControl?: boolean;
  disallowPartial?: boolean;
};

export type RangeOptions = {
  from?: Options & { date?: Date };
  to?: Options & { date?: Date };
};

type Events = {
  changeDate: Date | undefined;
  focusWrap: "start" | "end";
};

export class TimescapeManager implements Options {
  minDate?: Options["minDate"];
  maxDate?: Options["maxDate"];
  hour12?: Options["hour12"] = false;
  digits?: Options["digits"] = "2-digit";
  wrapAround?: Options["wrapAround"] = false;
  snapToStep?: Options["snapToStep"] = false;
  wheelControl?: Options["wheelControl"] = false;
  disallowPartial?: Options["disallowPartial"] = false;

  #instanceId = Math.random().toString(36).slice(2);
  #timestamp: number | undefined;
  // The previous timestamp is used to render partial dates when a field has been cleared.
  #prevTimestamp: number | undefined;
  #registry: Registry = new Map();
  #pubsub: ReturnType<typeof createPubSub<Events>>;
  #rootElement?: HTMLElement;
  #rootListener?: () => void;
  #cursorPosition = 0;
  #resizeObserver =
    typeof window !== "undefined"
      ? new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const inputElement = [...this.#registry.values()].find(
              ({ shadowElement }) => shadowElement === entry.target,
            )?.inputElement;

            if (!inputElement || !entry.contentBoxSize[0]?.inlineSize) return;
            inputElement.style.width = `${entry.contentBoxSize[0].inlineSize}px`;
          });
        })
      : undefined;
  #mutationObserver =
    typeof window !== "undefined"
      ? new MutationObserver((mutations) => {
          let added = 0;
          let removed = 0;

          mutations.forEach((mutation) => {
            added += mutation.addedNodes.length;
            removed += mutation.removedNodes.length;
          });

          if (added > 0) {
            this.#sortRegistryByElements();
          }

          if (removed > 0) {
            mutations.forEach((mutation) => {
              mutation.removedNodes.forEach((node) => {
                const entry = this.#findByInputElement(node);

                if (!entry) return;

                entry.inputElement.remove();
                entry.shadowElement.remove();
                entry.listeners.forEach((listener) => listener());
                this.#registry.delete(entry.type);
              });
            });
          }
        })
      : undefined;

  get date(): Date | undefined {
    return this.#timestamp && this.isCompleted()
      ? new Date(this.#timestamp)
      : undefined;
  }

  set date(nextDate: Date | number | string | undefined) {
    this.#setDate(nextDate ? new Date(nextDate) : undefined);
  }

  constructor(initialDate?: Date, options?: Options) {
    this.#timestamp = initialDate?.getTime();
    this.#pubsub = createPubSub<Events>();

    if (options) {
      this.minDate = options.minDate;
      this.maxDate = options.maxDate;
      this.hour12 = options.hour12;
      this.digits = options.digits;
      this.wrapAround = options.wrapAround;
      this.snapToStep = options.snapToStep;
      this.wheelControl = options.wheelControl;
      this.disallowPartial = options.disallowPartial;
    }

    return new Proxy(this, {
      get: (target: this, property: keyof this & string) => {
        const original = target[property];
        if (typeof original === "function") {
          return (...args: unknown[]) => original.apply(target, args);
        }
        return original;
      },
      // biome-ignore lint/suspicious/noExplicitAny: nextValue can be any
      set: (target: this, property: keyof this & string, nextValue: any) => {
        switch (property) {
          case "minDate":
          case "maxDate":
            // minDate and maxDate are also calling updateDate to validate the date
            target[property] = nextValue;
            if (target.#timestamp) {
              target.#setDate(new Date(target.#timestamp));
            }
            break;
          case "hour12":
          case "digits":
            target[property] = nextValue;
            target.#syncAllElements();
            break;
          case "wheelControl":
          case "disallowPartial":
            if (nextValue === target[property]) return true;
            target[property] = nextValue;
            this.resync();
            break;
          default:
            target[property] = nextValue;
        }

        return true;
      },
    });
  }

  public resync() {
    if (this.#rootElement) {
      this.#rootListener?.();
      this.registerRoot(this.#rootElement);
    }

    Array.from(this.#registry).forEach(([type, entry]) => {
      entry.listeners.forEach((listener) => listener());
      this.#registry.delete(type);
      this.registerElement(entry.inputElement, type, entry.autofocus, true);
    });
  }

  public registerRoot(element: HTMLElement) {
    element.tabIndex = -1;
    element.setAttribute("role", "group");
    this.#rootElement = element;

    const hasOtherRoot =
      element.dataset.timescapeInstance &&
      element.dataset.timescapeInstance !== this.#instanceId;

    if (!hasOtherRoot) element.dataset.timescapeInstance = this.#instanceId;

    this.#rootListener = addElementListener(element, "focus", (e) => {
      if (hasOtherRoot) return;

      const activeField = element.querySelector("input[aria-selected]");

      if (activeField) {
        if (e.relatedTarget instanceof HTMLElement) e.relatedTarget.focus();
      } else {
        this.focusField(0);
      }
    });
    this.#mutationObserver?.observe(element, {
      childList: true,
      subtree: true,
    });
  }

  public registerElement(
    element: HTMLInputElement,
    type: DateType,
    autofocus?: boolean,
    domExists = false,
  ) {
    const registryEntry = this.#registry.get(type);
    if (!domExists && element === registryEntry?.inputElement) {
      return;
    }

    element.type = "text";
    element.readOnly = !isTouchDevice();
    element.tabIndex = 0;
    element.enterKeyHint = "next";
    element.spellcheck = false;
    element.autocapitalize = "off";
    element.setAttribute("role", "spinbutton");
    element.dataset.timescapeInput = "";

    switch (type) {
      case "days":
        element.placeholder ||= "dd";
        break;
      case "months":
        element.placeholder ||= "mm";
        break;
      case "years":
        element.placeholder ||= "yyyy";
        break;
      case "hours":
      case "minutes":
      case "seconds":
        element.placeholder ||= "--";
        break;
      case "milliseconds":
        element.placeholder ||= "----";
        break;
      case "am/pm":
        element.placeholder ||= "am";
        break;
    }

    if (autofocus) {
      requestAnimationFrame(() => element.focus());
    }

    if (type !== "am/pm") {
      element.inputMode = "numeric";
    }

    let shadowElement: HTMLSpanElement;

    const sibling = element.nextElementSibling;
    if (
      sibling instanceof HTMLSpanElement &&
      sibling.dataset.timescapeShadow === type
    ) {
      shadowElement = sibling;
    } else if (!domExists || !registryEntry?.shadowElement) {
      shadowElement = document.createElement("span");
      shadowElement.setAttribute("aria-hidden", "true");
      shadowElement.textContent = element.value || element.placeholder;
      shadowElement.dataset.timescapeShadow = type;
      shadowElement.style.cssText = [
        "display: inline-block",
        "position: absolute",
        "left: -9999px",
        "top: -9999px",
        "visibility: hidden",
        "pointer-events: none",
        "white-space: pre",
      ].join(";");

      this.#copyStyles(element, shadowElement);
      this.#resizeObserver?.observe(shadowElement);
      element.parentNode?.insertBefore(shadowElement, element.nextSibling);
    } else {
      shadowElement = registryEntry.shadowElement;
    }

    this.#registry.set(type, {
      type,
      inputElement: element,
      autofocus,
      shadowElement,
      intermediateValue: "",
      isUnset: !this.#timestamp && !this.disallowPartial,
      listeners: this.#createListeners(element, type),
    } satisfies RegistryEntry);

    this.on("changeDate", () => this.#syncElement(element));
    this.#syncElement(element);

    return element;
  }

  /**
   * Returns whether all fields are filled out. Can only be false in partial mode.
   * @returns {boolean}
   */
  public isCompleted(): boolean {
    return !this.disallowPartial
      ? [...this.#registry.values()].every((e) => !e.isUnset)
      : true;
  }

  public remove() {
    this.#rootListener?.();
    this.#registry.forEach(({ shadowElement, listeners }) => {
      listeners.forEach((remove) => remove());
      shadowElement.remove();
    });
    this.#pubsub.events = {};
    this.#resizeObserver?.disconnect();
    this.#mutationObserver?.disconnect();
  }

  public focusField(which = 0) {
    const entries = [...this.#registry.values()];
    const type = entries.at(which)?.type;

    type && this.#registry.get(type)?.inputElement.focus();
  }

  public on<E extends keyof Events>(event: E, callback: Callback<Events[E]>) {
    return this.#pubsub.on(event, callback);
  }

  #findByInputElement = (input: HTMLElement | EventTarget | null) =>
    [...this.#registry.values()].find(
      ({ inputElement }) => inputElement === input,
    );

  #copyStyles = (from: HTMLElement, to: HTMLElement) => {
    const styles = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "fontVariant",
      "letterSpacing",
      "textTransform",
      "textIndent",
      "textOrientation",
    ] as const;

    requestAnimationFrame(() => {
      const computedStyles = window.getComputedStyle(from);
      for (const key of styles) {
        to.style[key] = computedStyles[key];
      }
    });
  };

  get #currentDate(): Date {
    return this.#timestamp ? new Date(this.#timestamp) : new Date();
  }

  #getValue(type: DateType): string {
    const registryEntry = this.#registry.get(type);
    const intermediateValue = registryEntry?.intermediateValue;

    if (registryEntry?.isUnset) return "";

    const ts = this.#timestamp ?? this.#prevTimestamp;

    return intermediateValue
      ? type === "years"
        ? intermediateValue.padStart(4, "0")
        : type === "milliseconds"
          ? intermediateValue.padStart(3, "0")
          : intermediateValue.padStart(
              type === "minutes" || type === "seconds"
                ? 2
                : this.digits === "2-digit"
                  ? 2
                  : 1,
              "0",
            )
      : ts
        ? format(new Date(ts), type, this.hour12, this.digits)
        : "";
  }

  #wrapDateAround(step: number, type: DateType) {
    const ranges = {
      seconds: 60,
      minutes: 60,
      hours: this.hour12 ? 12 : 24,
      months: 12,
      milliseconds: 1000,
    } as const;

    let date = this.#currentDate;

    // doesn't make sense to wrap these around
    if (type === "years" || type === "am/pm") {
      return add(date, "years", step);
    }

    if (type === "days") {
      const daysMonth = daysInMonth(date);
      const newValue =
        ((date.getDate() + step - 1 + daysMonth) % daysMonth) + 1;
      date.setDate(newValue);
    } else {
      const newValue = (get(date, type) + step + ranges[type]) % ranges[type];
      date = set(date, type, newValue);
    }
    return date;
  }

  #clearIntermediateState(registryEntry: RegistryEntry) {
    const { intermediateValue, type } = registryEntry;
    if (intermediateValue) {
      this.#setDate(
        set(
          this.#currentDate,
          type,
          type === "months"
            ? Number(intermediateValue) - 1
            : Number(intermediateValue),
        ),
      );
      registryEntry.intermediateValue = "";
      this.#cursorPosition = 0;
    }
  }

  #handleKeyDown(e: KeyboardEvent) {
    if (e.defaultPrevented) return;

    const registryEntry = this.#findByInputElement(e.target);

    if (!registryEntry) return;

    const { inputElement, intermediateValue, type } = registryEntry;

    let allowNativeEvent = false;

    const key = e.key;

    switch (true) {
      case key === "ArrowUp":
      case key === "ArrowDown": {
        this.#clearIntermediateState(registryEntry);
        const date = this.#currentDate;
        const elementStep =
          !this.disallowPartial && registryEntry.isUnset
            ? 0
            : Number(inputElement.step) || 1;

        registryEntry.isUnset = false;

        if (type === "am/pm") {
          this.#setDate(elementStep === 0 ? date : toggleAmPm(date));
          this.#syncElement(inputElement);
          break;
        }

        let step: number;
        if (this.snapToStep) {
          const value = get(date, type);

          if (e.key === "ArrowUp") {
            step = Math.ceil((value + 1) / elementStep) * elementStep - value;
          } else {
            step = Math.floor((value - 1) / elementStep) * elementStep - value;
          }
        } else {
          const factor = e.key === "ArrowUp" ? 1 : -1;

          step = elementStep * factor;
        }

        this.#setDate(
          this.wrapAround || !this.isCompleted()
            ? this.#wrapDateAround(step, type)
            : add(date, type, step),
        );
        this.#syncAllElements();
        break;
      }
      case key === "ArrowRight":
      case key === "Enter":
        this.#focusNextField(type, 1, true);
        break;
      case key === "Tab": {
        const tabOffset = e.shiftKey ? -1 : 1;
        allowNativeEvent = !this.#focusNextField(type, tabOffset);
        break;
      }
      case key === "ArrowLeft":
        this.#focusNextField(type, -1, true);
        break;
      case type === "am/pm" && ["a", "p"].includes(key.toLowerCase()): {
        const force = key.toLowerCase() === "a" ? "am" : "pm";
        registryEntry.isUnset = false;
        this.#setDate(toggleAmPm(this.#currentDate, force));
        this.#syncElement(inputElement);
        break;
      }
      case key === "Delete":
      case key === "Backspace" && type === "am/pm":
        if (this.disallowPartial) return;

        registryEntry.isUnset = true;
        if (this.#timestamp) this.#prevTimestamp = this.#timestamp;
        this.#setDate(undefined);
        this.#syncElement(inputElement);
        break;

      case key === "Backspace": {
        if (this.disallowPartial) return;
        if (type === "am/pm") return;

        const newValue = intermediateValue || inputElement.value;
        registryEntry.intermediateValue = newValue
          .slice(0, -1)
          .replace(/^0+/, "");

        if (!registryEntry.intermediateValue) {
          registryEntry.isUnset = true;
          if (this.#timestamp) this.#prevTimestamp = this.#timestamp;
          this.#setDate(undefined);
        }
        this.#syncElement(inputElement);
        break;
      }
      case /^\d$/.test(key): {
        const number = Number(key);

        if (e.metaKey || e.ctrlKey) {
          allowNativeEvent = true;
          break;
        }

        const setIntermediateValue = (value: string) => {
          registryEntry.intermediateValue = value;
          registryEntry.isUnset = false;
          this.#syncElement(inputElement);
        };
        const setValue = (unit: DateType, value: number) => {
          const newDate = set(this.#currentDate, unit, value);

          registryEntry.intermediateValue = "";
          registryEntry.isUnset = false;

          this.#setDate(newDate);
          this.#syncElement(inputElement);
          this.#cursorPosition = 0;
        };

        switch (type) {
          case "days":
            if (this.#cursorPosition === 0) {
              setIntermediateValue(key);

              // When the user types a number greater than 3, we can assume they're done typing the day
              if (number > 3) {
                setValue("days", number);
                this.#focusNextField(type);
              } else {
                this.#cursorPosition = 1;
              }
            } else {
              // Between 1 and days in month for the current year
              const finalValue = Math.max(
                1,
                Math.min(
                  Number(intermediateValue + key),
                  daysInMonth(this.#currentDate),
                ),
              );
              setValue("days", finalValue);
              this.#focusNextField(type);
            }
            break;
          case "months":
            if (this.#cursorPosition === 0) {
              setIntermediateValue(key);

              // When the user types a number greater than 1, we can assume they're done typing the month
              if (number > 1) {
                setValue("months", number - 1);
                this.#focusNextField(type);
              } else {
                this.#cursorPosition = 1;
              }
            } else {
              const finalValue = Math.max(
                0,
                // Subtract 1 because JS months are 0-based
                // Prevent negative so years are not wrapped around
                Math.min(Number(intermediateValue + key), 12) - 1,
              );
              setValue("months", finalValue);
              this.#focusNextField(type);
            }
            break;
          case "years":
            if (this.#cursorPosition < 4) {
              // Append the new digit and shift the digits to the left
              const newValue = intermediateValue + key;
              setIntermediateValue(newValue);
              this.#cursorPosition += 1;

              // When we have 4 digits, update the actual year
              if (this.#cursorPosition === 4) {
                setValue("years", Number(newValue));
                this.#focusNextField(type);
              }
            }
            break;
          case "hours": {
            const isPM = this.#currentDate.getHours() >= 12;

            if (this.#cursorPosition === 0) {
              setIntermediateValue(key);

              const maxFirstDigit = this.hour12 ? 1 : 2;
              // When the user types a number greater than 1/2 , we can assume they're done typing the hours
              if (number > maxFirstDigit) {
                // If the current time is PM, we need to add 12 to the hours to keep it PM
                setValue("hours", this.hour12 && isPM ? number + 12 : number);
                this.#focusNextField(type);
                break;
              }

              this.#cursorPosition = 1;
            } else {
              const inputValue = Number(intermediateValue + key);
              const maxHours = this.hour12 ? 12 : 24;

              let finalValue = inputValue > maxHours ? number : inputValue;

              // Keep AM/PM like before
              if (this.hour12) {
                const date = set(this.#currentDate, "hours", finalValue);
                finalValue = toggleAmPm(date, isPM ? "pm" : "am").getHours();
              }

              setValue("hours", finalValue);
              this.#focusNextField(type);
            }
            break;
          }
          case "minutes":
          case "seconds":
            if (this.#cursorPosition === 0) {
              setIntermediateValue(key);

              // When the user types a number greater than 5, we can assume they're done typing the minutes
              if (number > 5) {
                setValue(type, number);
                this.#focusNextField(type);
              } else {
                this.#cursorPosition = 1;
              }
            } else {
              const finalValue = Math.min(Number(intermediateValue + key), 59);
              setValue(type, finalValue);
              this.#focusNextField(type, 1);
            }
            break;
          case "milliseconds":
            if (this.#cursorPosition < 3) {
              const newValue = intermediateValue + key;
              setIntermediateValue(newValue);
              this.#cursorPosition += 1;

              if (this.#cursorPosition === 3) {
                setValue("milliseconds", Number(newValue));
                this.#focusNextField(type);
              }
            }
            break;
        }
        break;
      }
      default:
        allowNativeEvent = true;
        break;
    }

    if (!allowNativeEvent) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  #handleClick(e: MouseEvent) {
    const target = e.target as HTMLInputElement;
    target.focus();
  }

  #handleFocus(e: FocusEvent) {
    const target = e.target as HTMLInputElement;
    target.setAttribute("aria-selected", "true");
    this.#cursorPosition = 0;
  }

  #handleBlur(e: FocusEvent) {
    requestAnimationFrame(() => {
      if (e.target !== document.activeElement) {
        const registryEntry = this.#findByInputElement(e.target);
        if (registryEntry) this.#clearIntermediateState(registryEntry);

        const target = e.target as HTMLInputElement;
        target.removeAttribute("aria-selected");
      }
    });
  }

  // Because the order of insertion is important for which field is selected when tabbing,
  // we need to sort the registry by the order of the input elements in the DOM.
  #sortRegistryByElements() {
    this.#registry = new Map(
      [...this.#registry.entries()].sort(([, a], [, b]) =>
        a.inputElement.compareDocumentPosition(b.inputElement) &
        (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY)
          ? -1
          : 1,
      ),
    );
  }

  #syncAllElements() {
    this.#registry.forEach((entry) => this.#syncElement(entry.inputElement));
  }

  #syncElement(element: HTMLInputElement) {
    const entry = this.#findByInputElement(element);

    if (!entry) return;

    const { type, shadowElement } = entry;

    const value = this.#getValue(type);

    if (element.value === value) return;

    element.value = value;
    element.setAttribute("aria-label", type);

    if (type !== "am/pm") {
      // removes leading zeroes
      element.setAttribute("aria-valuenow", value.replace(/^0/, ""));
      element.setAttribute(
        "aria-valuemin",
        ["days", "months", "years"].includes(type) ? "1" : "0",
      );
      element.setAttribute(
        "aria-valuemax",
        (type === "days"
          ? daysInMonth(this.#currentDate)
          : type === "months"
            ? 12
            : type === "years"
              ? 9999
              : type === "hours"
                ? 23
                : type === "minutes" || type === "seconds"
                  ? 59
                  : type === "milliseconds"
                    ? 999
                    : ""
        ).toString(),
      );
    }

    if (shadowElement.textContent !== value) {
      shadowElement.textContent = value || element.placeholder;
    }
  }

  #createListeners(element: HTMLInputElement, type: DateType) {
    const listeners = [
      addElementListener(element, "keydown", (e) => this.#handleKeyDown(e)),
      addElementListener(element, "click", (e) => this.#handleClick(e)),
      addElementListener(element, "focus", (e) => this.#handleFocus(e)),
      addElementListener(element, "focusout", (e) => this.#handleBlur(e)),
    ];

    if (this.wheelControl) {
      listeners.push(
        addElementListener(element, "wheel", (e) => {
          e.preventDefault();
          const step = Math.sign(e.deltaY);
          this.#setDate(
            this.wrapAround
              ? this.#wrapDateAround(step, type)
              : add(this.#currentDate, type, step),
          );
        }),
      );
    }

    return listeners;
  }

  /**
   * Sets a validated date and emits a changeDate event.
   * It also caps the date to the minDate and maxDate if they are set.
   * Only emits the changeDate event if the date is complete (in partial mode).
   */
  #setDate(date: Date | undefined) {
    if (!date) {
      this.#timestamp = undefined;
      this.#pubsub.emit("changeDate", undefined);
      return;
    }

    const minDate = this.minDate === $NOW ? new Date() : this.minDate;
    const maxDate = this.maxDate === $NOW ? new Date() : this.maxDate;

    let validatedDate = date;

    if (minDate && validatedDate < minDate) {
      validatedDate = minDate;
    } else if (maxDate && validatedDate > maxDate) {
      validatedDate = maxDate;
    }

    if (
      this.#timestamp &&
      isSameSeconds(validatedDate.getTime(), this.#timestamp) &&
      !this.isCompleted()
    ) {
      return;
    }

    this.#timestamp = validatedDate.getTime();
    this.#prevTimestamp = undefined;

    if (!this.isCompleted()) return;
    this.#pubsub.emit("changeDate", validatedDate);
  }

  /**
   *
   * @returns {Boolean} Whether the next field was focused or not
   */
  #focusNextField(type: DateType, offset = 1, wrap?: boolean): boolean {
    const types = [...this.#registry.keys()];
    const index = types.indexOf(type);

    const nextIndex = wrap
      ? types[(index + offset + types.length) % types.length]
      : types[index + offset];
    if (nextIndex) this.#registry.get(nextIndex)?.inputElement.focus();

    if (
      wrap &&
      ((index === 0 && offset <= -1) ||
        (index === types.length - 1 && offset >= 1))
    ) {
      this.#pubsub.emit("focusWrap", offset === -1 ? "start" : "end");
    }

    return !!nextIndex;
  }
}

export default TimescapeManager;
