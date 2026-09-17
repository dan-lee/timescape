import { html, render } from "htm/preact";
import { useState } from "preact/hooks";
import { useTimescape, useTimescapeRange } from "timescape/preact";

const PreactDemo = () => {
  const [date, setDate] = useState<Date | null>(window.date ?? new Date());

  const { getRootProps, getInputProps } = useTimescape({
    date,
    onDateChange: (date) => {
      console.log("Date changed to", date);
      setDate(date);
    },
  });

  const {
    getRootProps: getRangeRootProps,
    from,
    to,
  } = useTimescapeRange({
    from: {
      defaultDate: new Date(),
      onDateChange: (date) => console.log("Range `from` changed to", date),
    },
    to: {
      defaultDate: new Date(Date.now() + 31536e6 * 3), // 3 years from now
      onDateChange: (date) => console.log("Range `to` changed to", date),
    },
  });

  return html`
    <div>
      Simple date time:
      <div class="timescape-root" ...${getRootProps()}>
        <input class="timescape-input" ...${getInputProps("years")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${getInputProps("months")} />
        <span class="separator">/</span>
        <input class="timescape-input" ...${getInputProps("days")} />
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
      <div id="output" style="display: none">
        ${date?.toISOString()}
      </div>
    </div>
  `;
};

export const renderTo = (element: HTMLElement) => {
  render(html`<${PreactDemo} />`, element);

  return () => render(null as never, element);
};
