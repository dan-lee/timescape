import { useState } from "react";
import { useTimescape } from "timescape/react";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

const App = () => {
  const [hour12] = useState(false);
  const { getRootProps, getInputProps } = useTimescape({
    // Edit these options in real-time 👇
    defaultDate: new Date(),
    disallowPartial: false,
    minDate: undefined,
    maxDate: undefined,
    hour12,
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
    wheelControl: false,
  });

  return (
    <div {...getRootProps()} className={root}>
      <input className={input} {...getInputProps("years")} />
      <span className={separator}>/</span>
      <input className={input} {...getInputProps("months")} />
      <span className={separator}>/</span>
      <input className={input} {...getInputProps("days")} />
      <span className={separator}>⋆</span>
      <input className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("minutes")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("seconds")} />
      {hour12 && <input className={input} {...getInputProps("am/pm")} />}
    </div>
  );
};

export default App;
