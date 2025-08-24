import { useState } from "react";
import { useTimescape } from "timescape/react";
import { input, root, separator } from "../timescape.css";

const App = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { getRootProps, getInputProps } = useTimescape({
    date,
    onChangeDate: (date) => setDate(date),
    hour12: true,
  });

  return (
    <div>
      <div {...getRootProps()} className={root}>
        <input
          placeholder="yyyy"
          className={input}
          {...getInputProps("years")}
        />
        <span className={separator}>/</span>
        <input
          placeholder="mm"
          className={input}
          {...getInputProps("months")}
        />
        <span className={separator}>/</span>
        <input placeholder="dd" className={input} {...getInputProps("days")} />
        <span className={separator}>&nbsp;</span>
        <input placeholder="--" className={input} {...getInputProps("hours")} />
        <span className={separator}>:</span>
        <input
          placeholder="--"
          className={input}
          {...getInputProps("minutes")}
        />
        <span className={separator}>:</span>
        <input
          placeholder="--"
          className={input}
          {...getInputProps("seconds")}
        />
        <span className={separator}>&nbsp;</span>
        <input placeholder="am" className={input} {...getInputProps("am/pm")} />
      </div>
      <pre style={{ position: "absolute" }}>
        Output: {date?.toISOString() ?? "-"}
      </pre>
    </div>
  );
};

export default App;
