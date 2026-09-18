import { useDatePicker } from "@rehookify/datepicker";
import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { Calendar } from "../calendar";
import { SetOptions } from "../SetOptions";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

import { UpdateFlasher } from "../UpdateFlasher";

const App = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [options, setOptions] = useState<Options>({
    date: new Date(),
  });
  const { getRootProps, getInputProps } = useTimescape({
    // Edit these options in real-time 👇
    ...options,
    onDateChange: (date) => {
      setOptions((prev) => ({ ...prev, date }));
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
