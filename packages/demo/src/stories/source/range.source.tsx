import { useState } from "react";
import { useTimescapeRange } from "timescape/react";
import { flex, input, root, separator } from "../timescape.css";

const App = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date("2025-01-01"),
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    new Date("2025-12-31"),
  );
  const { from, to, getRootProps } = useTimescapeRange({
    from: {
      date: fromDate,
      onChange: (nextDate) => setFromDate(nextDate),
    },
    to: {
      date: toDate,
      onChange: (nextDate) => setToDate(nextDate),
    },
  });

  return (
    <div>
      <div className={root} {...getRootProps()}>
        <div className={flex}>
          <input className={input} {...from.getInputProps("years")} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps("months")} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps("days")} />
        </div>
        <span className={separator}>&mdash;</span>
        <div className={flex}>
          <input className={input} {...to.getInputProps("years")} />
          <span className={separator}>/</span>
          <input className={input} {...to.getInputProps("months")} />
          <span className={separator}>/</span>
          <input className={input} {...to.getInputProps("days")} />
        </div>
      </div>
    </div>
  );
};

export default App;
