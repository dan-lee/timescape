import { useState } from "react";
import { useTimescape, useTimescapeRange } from "timescape/react";

console.log("hello", window.date);

export const ReactDemo = () => {
  const [hour12, setHour12] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    () => window.date ?? new Date(),
  );
  const { getRootProps, getInputProps } = useTimescape({
    date,
    onChangeDate: (newDate) => {
      console.log("date changed", newDate);
      setDate(newDate);
    },
    hour12,
  });

  const {
    getRootProps: getRangeRootProps,
    from,
    to,
  } = useTimescapeRange({
    from: {
      date: new Date(),
      onChangeDate: (date) => {
        console.log("from date changed", date);
      },
    },
    to: {
      date: new Date("2027-12-31"),
      onChangeDate: (date) => {
        console.log("to date changed", date);
      },
    },
  });

  return (
    <div>
      Simple date time:
      <div className="timescape-root" {...getRootProps()}>
        <input
          className="timescape-input"
          {...getInputProps("years")}
          placeholder="yyyy"
        />
        <span className="separator">/</span>
        <input
          className="timescape-input"
          {...getInputProps("months")}
          placeholder="mm"
        />
        <span className="separator">/</span>
        <input
          className="timescape-input"
          {...getInputProps("days")}
          placeholder="dd"
        />
        <span className="separator">&nbsp;</span>
        <input
          className="timescape-input"
          {...getInputProps("hours")}
          placeholder="hh"
        />
        <span className="separator">:</span>
        <input
          className="timescape-input"
          {...getInputProps("minutes")}
          placeholder="mm"
          step={10}
        />
        <span className="separator">:</span>
        <input
          className="timescape-input"
          {...getInputProps("seconds")}
          placeholder="mm"
        />
        <span className="separator">&nbsp;</span>
        {hour12 && (
          <input
            className="timescape-input"
            {...getInputProps("am/pm")}
            placeholder="am/pm"
          />
        )}
      </div>
      <label>
        12 hour clock:
        <input
          type="checkbox"
          checked={hour12}
          onChange={(e) => setHour12(e.target.checked)}
        />
      </label>
      <br />
      <br />
      Range:
      <div>
        <div className="timescape-root" {...getRangeRootProps()}>
          <input className="timescape-input" {...from.getInputProps("years")} />
          <span className="separator">/</span>
          <input
            className="timescape-input"
            {...from.getInputProps("months")}
          />
          <span className="separator">/</span>
          <input className="timescape-input" {...from.getInputProps("days")} />
          <span className="separator">&ndash;</span>
          <input className="timescape-input" {...to.getInputProps("years")} />
          <span className="separator">/</span>
          <input className="timescape-input" {...to.getInputProps("months")} />
          <span className="separator">/</span>
          <input className="timescape-input" {...to.getInputProps("days")} />
        </div>
      </div>
      <div id="output" style={{ display: "none" }}>
        {date?.toISOString()}
      </div>
    </div>
  );
};
