import { useEffect } from "react";
import { useTimescape, useTimescapeRange } from "timescape/react";

export const ReactDemo = () => {
  const { getRootProps, getInputProps, options } = useTimescape({
    date: new Date(),
  });

  const {
    getRootProps: getRangeRootProps,
    from,
    to,
  } = useTimescapeRange({
    from: {
      date: new Date(),
      onChangeDate: () => {
        console.log("from date changed");
      },
    },
    to: {
      date: new Date("2024-12-31"),
      onChangeDate: () => {
        console.log("to date changed");
      },
    },
  });

  useEffect(() => {
    console.log("Date changed", options.date);
  }, [options.date]);

  return (
    <div>
      Simple date time:
      <div className="timescape-root" {...getRootProps()}>
        <input
          className="timescape-input"
          {...getInputProps("days")}
          placeholder="dd"
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
          {...getInputProps("years")}
          placeholder="yyyy"
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
      </div>
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
    </div>
  );
};
