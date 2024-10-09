import { useSignalEffect } from "@preact/signals";
import { html, render } from "htm/preact";
import { useTimescape, useTimescapeRange } from "timescape/preact";

const PreactDemo = () => {
  const { getRootProps, getInputProps, options } = useTimescape({
    date: new Date(),
  });

  const {
    getRootProps: getRangeRootProps,
    from,
    to,
  } = useTimescapeRange({
    from: { date: new Date() },
    to: { date: new Date("2024-12-31") },
  });

  useSignalEffect(() => {
    console.log("Date changed to", options.value);
  });
  useSignalEffect(() => {
    console.log("Range `from` changed to", from.options.value.date);
  });
  useSignalEffect(() => {
    console.log("Range `to` changed to", to.options.value.date);
  });

  return html`
    <div>
      Simple date time:
      <div class="timescape-root" ...${getRootProps()}>
        <input class="timescape-input" ...${getInputProps("days")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${getInputProps("months")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${getInputProps("years")} />
        <!-- non-breaking space -->
        <span class="separator">${"\xA0"}</span>
        <input class="timescape-input" ...${getInputProps("hours")} />
        <span class="separator">:</span>
        <input class="timescape-input" ...${getInputProps("minutes")} />
        <span class="separator">:</span>
        <input class="timescape-input" ...${getInputProps("seconds")} />
      </div>
      <br />
      Range:
      <div class="timescape-root" ...${getRangeRootProps()}>
        <input class="timescape-input" ...${from.getInputProps("years")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${from.getInputProps("months")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${from.getInputProps("days")} />
        <span class="separator">–</span>
        <input class="timescape-input" ...${to.getInputProps("years")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${to.getInputProps("months")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${to.getInputProps("days")} />
      </div>
    </div>
  `;
};

export const renderTo = (element: HTMLElement) => {
  render(html`<${PreactDemo} />`, element);

  return () => render(null as never, element);
};
