import { useDatePicker } from "@rehookify/datepicker";
import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { Calendar } from "../calendar";
import { SetOptions } from "../SetOptions";
import { input, root, separator } from "../timescape.css";
import { UpdateFlasher } from "../UpdateFlasher";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [options, setOptions] = useState<Options>({
    date: new Date(),
  });
  const { getRootProps, getInputProps } = useTimescape({
    // Edit these options in real-time 👇
    ...options,
    onChange: (date) => {
      if (!date) return;

      setSelectedDate(date);
      // Jumps to selected calendar month if necessary
      dpCalendar.propGetters.setOffset(date).onClick?.(undefined as never);
    },
  });

  const dpCalendar = useDatePicker({
    selectedDates: selectedDate ? [selectedDate] : [],
    onDatesChange: ([date]) => {
      setOptions((prev) => ({ ...prev, date }));
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
        updateFn={setOptions}
      />
    </div>
  );
};

export default App;
