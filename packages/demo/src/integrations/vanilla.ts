import { type DateType, marry, TimescapeManager } from "timescape";

const prepare = (container: HTMLElement) => {
  container.innerHTML = `
    Simple date time:
    <div class="timescape-root simple">
      <input class="timescape-input" data-type="years" />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="months" />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="days" />
      <span class="separator">&nbsp;</span>
      <input class="timescape-input" data-type="hours" />
      <span class="separator">:</span>
      <input class="timescape-input" data-type="minutes" />
      <span class="separator">:</span>
      <input class="timescape-input" data-type="seconds" />
    </div>
    <br>
    Range:
    <div class="timescape-root range">
      <input class="timescape-input" data-type="years" data-range="from" />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="months" data-range="from"  />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="days" data-range="from" />

      <span class="separator">&mdash;</span>

      <input class="timescape-input" data-type="years" data-range="to" />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="months" data-range="to" />
      <span class="separator">/</span>
      <input class="timescape-input" data-type="days" data-range="to" />
    </div>
  `.trim();
};

export const renderTo = (container: HTMLElement) => {
  prepare(container);

  const manager = new TimescapeManager(new Date());

  manager.on("changeDate", (date) => {
    console.log("changed date", date);
  });

  const simple = container.querySelector<HTMLElement>(".timescape-root.simple");

  if (!simple) {
    throw new Error("Root not found");
  }

  manager.registerRoot(simple);

  const elements =
    simple.querySelectorAll<HTMLInputElement>(".timescape-input");

  for (const element of elements) {
    manager.registerElement(element, element.dataset.type as DateType);
  }

  // Range

  const fromManager = new TimescapeManager(new Date());
  const toManager = new TimescapeManager(new Date("2025"));

  fromManager.on("changeDate", (date) => {
    console.log("changed range from", date);
  });

  toManager.on("changeDate", (date) => {
    console.log("changed range to", date);
  });

  marry(fromManager, toManager);

  const range = container.querySelector<HTMLElement>(".timescape-root.range");

  if (!range) {
    throw new Error("Range root not found");
  }

  fromManager.registerRoot(range);
  toManager.registerRoot(range);

  const fromElements = range.querySelectorAll<HTMLInputElement>(
    '.timescape-input[data-range="from"]',
  );

  for (const element of fromElements) {
    fromManager.registerElement(element, element.dataset.type as DateType);
  }

  const toElements = range.querySelectorAll<HTMLInputElement>(
    '.timescape-input[data-range="to"]',
  );

  for (const element of toElements) {
    toManager.registerElement(element, element.dataset.type as DateType);
  }

  return () => {
    manager.remove();
    container.innerHTML = "";
  };
};
