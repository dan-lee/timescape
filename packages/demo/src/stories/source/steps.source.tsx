import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

const App = () => {
  // 👇 steps for the input fields
  const steps = {
    hours: 1,
    minutes: 15,
    seconds: 30,
  };

  const [options, setOptions] = useState<Options>({
    hour12: true,
    digits: "2-digit",
    snapToStep: false,
  });

  const { getRootProps, getInputProps } = useTimescape({
    ...options,
    defaultDate: new Date(),
  });

  return (
    <>
      <div {...getRootProps()} className={root}>
        <input
          step={steps.hours}
          className={input}
          {...getInputProps("hours")}
        />
        <span className={separator}>:</span>
        <input
          step={steps.minutes}
          className={input}
          {...getInputProps("minutes")}
        />
        <span className={separator}>:</span>
        <input
          step={steps.seconds}
          className={input}
          {...getInputProps("seconds")}
        />
      </div>
      <SetOptions
        enabled={["snapToStep", "wrapAround", "hour12", "digits"]}
        options={options}
        updateFn={setOptions}
      />
    </>
  );
};

export default App;
