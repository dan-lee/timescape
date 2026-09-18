import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";
const wrapper = "flex flex-col items-center gap-8";

const App = () => {
  const [options, setOptions] = useState<Options>({
    date: new Date(),
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
  });
  const { getRootProps, getInputProps } = useTimescape({
    ...options,
    onDateChange: (date) => setOptions((prev) => ({ ...prev, date })),
  });

  return (
    <div className={wrapper}>
      <div {...getRootProps()} className={root}>
        <input className={input} {...getInputProps("hours")} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps("minutes")} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps("seconds")} />
        <span className={separator}>.</span>
        <input
          className={input}
          {...getInputProps("milliseconds")}
          style={{ fontSize: "0.9rem" }}
        />
      </div>
      <SetOptions
        enabled={["date", "snapToStep", "wrapAround", "digits"]}
        options={options}
        updateFn={setOptions}
      />
    </div>
  );
};

export default App;
