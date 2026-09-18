import { useDatePicker } from "@rehookify/datepicker";
import { useMemo, useState } from "react";
import { useTimescapeRange } from "timescape/react";
import { Calendar } from "../calendar";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

import { UpdateFlasher } from "../UpdateFlasher";

const App = () => {
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(
    new Date(String(new Date().getFullYear() + 1)),
  );

  const selectedDates = useMemo(
    () => [fromDate, toDate].filter((date) => date !== null),
    [fromDate, toDate],
  );

  const { getRootProps, from, to } = useTimescapeRange({
    from: {
      date: fromDate,
      onDateChange: (nextDate) => {
        setFromDate(nextDate);
        if (!nextDate) return;

        // Jumps to selected calendar month if necessary
        dpCalendar.propGetters
          .setOffset(nextDate)
          .onClick?.(undefined as never);
      },
    },
    to: {
      date: toDate,
      onDateChange: (nextDate) => {
        setToDate(nextDate);
        if (!nextDate) return;

        dpCalendar.propGetters
          .setOffset(nextDate)
          .onClick?.(undefined as never);
      },
    },
  });

  const dpCalendar = useDatePicker({
    dates: {
      mode: "range",
    },
    selectedDates,
    onDatesChange: ([rangeFrom, rangeTo]) => {
      setFromDate(rangeFrom ?? null);
      setToDate(rangeTo ?? null);
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
      }}
    >
      <Calendar state={dpCalendar} />

      <UpdateFlasher data={`${fromDate}-${toDate}`}>
        <div {...getRootProps()} className={root}>
          <input className={input} {...from.getInputProps("years")} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps("months")} />
          <span className={separator}>/</span>
          <input className={input} {...from.getInputProps("days")} />
          <span className={separator}>&ndash;</span>
          <input
            className={input}
            {...to.getInputProps("years")}
            placeholder="yyyy"
          />
          <span className={separator}>/</span>
          <input
            className={input}
            {...to.getInputProps("months")}
            placeholder="mm"
          />
          <span className={separator}>/</span>
          <input
            className={input}
            {...to.getInputProps("days")}
            placeholder="dd"
          />
        </div>
      </UpdateFlasher>
    </div>
  );
};

export default App;
