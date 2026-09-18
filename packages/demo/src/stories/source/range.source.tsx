import { useState } from "react";
import { useTimescapeRange } from "timescape/react";

const flex = "flex items-center";
const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

const App = () => {
  const [fromDate, setFromDate] = useState<Date | null>(new Date("2025-01-01"));
  const [toDate, setToDate] = useState<Date | null>(new Date("2025-12-31"));
  const { from, to, getRootProps } = useTimescapeRange({
    from: {
      date: fromDate,
      onDateChange: setFromDate,
    },
    to: {
      date: toDate,
      onDateChange: setToDate,
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
