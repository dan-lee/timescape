import { useDatePicker } from "@rehookify/datepicker";
import { useState } from "react";
import { useTimescape } from "timescape/react";

import { SetOptions } from "../SetOptions";
import { UpdateFlasher } from "../UpdateFlasher";
import { Calendar } from "../calendar";
import { input, root, separator } from "../timescape.css";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { getRootProps, getInputProps, options, update } = useTimescape({
    // Edit these options in real-time 👇
    date: new Date(),
    minDate: new Date("2021-01-01 00:00:01"),
    maxDate: new Date("2025-12-31 23:59:59"),
    onChangeDate: (date) => {
      if (!date) return;

      setSelectedDate(date);
      // Jumps to selected calendar month if necessary
      dpCalendar.propGetters.setOffset(date).onClick?.(undefined as never);
    },
  });

  const dpCalendar = useDatePicker({
    dates: {
      minDate: options.minDate === "$NOW" ? new Date() : options.minDate,
      maxDate: options.maxDate === "$NOW" ? new Date() : options.maxDate,
    },
    selectedDates: selectedDate ? [selectedDate] : [],
    onDatesChange: ([date]) => {
      update((prev) => ({ ...prev, date }));
      setSelectedDate(date);
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

      <UpdateFlasher data={String(options.date)}>
        <div {...getRootProps()} className={root}>
          <input className={input} {...getInputProps("years")} />
          <span className={separator}>/</span>
          <input className={input} {...getInputProps("months")} />
          <span className={separator}>/</span>
          <input className={input} {...getInputProps("days")} />
        </div>
      </UpdateFlasher>
      <SetOptions
        enabled={["minDate", "maxDate"]}
        options={options}
        updateFn={update}
      />
    </div>
  );
};

export default App;
