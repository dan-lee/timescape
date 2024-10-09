import { useDatePicker } from "@rehookify/datepicker";
import { useState } from "react";
import { useTimescapeRange } from "timescape/react";

import { UpdateFlasher } from "../UpdateFlasher";
import { Calendar } from "../calendar";
import { input, root, separator } from "../timescape.css";

const App = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const { getRootProps, from, to } = useTimescapeRange({
    from: {
      date: new Date(),
      onChangeDate: (nextDate) => {
        if (selectedDates.length !== 2 || !nextDate || !selectedDates[1])
          return;

        setSelectedDates([nextDate, selectedDates[1]]);
        dpCalendar.propGetters
          .setOffset(nextDate)
          .onClick?.(undefined as never);
      },
    },
    to: {
      date: new Date("2025"),
      onChangeDate: (nextDate) => {
        if (selectedDates.length !== 2 || !nextDate || !selectedDates[0])
          return;

        setSelectedDates([selectedDates[0], nextDate]);
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
    onDatesChange: (dates) => {
      setSelectedDates(dates);
      const [rangeFrom, rangeTo] = dates;

      from.update((prev) => ({ ...prev, date: rangeFrom }));
      to.update((prev) => ({ ...prev, date: rangeTo }));
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

      <UpdateFlasher data={`${from.options.date}-${to.options.date}`}>
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
