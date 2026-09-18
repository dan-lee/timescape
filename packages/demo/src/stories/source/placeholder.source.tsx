import { useTimescape } from "timescape/react";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

const App = () => {
  const { getRootProps, getInputProps } = useTimescape();

  return (
    <div {...getRootProps()} className={root}>
      <input placeholder="yyyy" className={input} {...getInputProps("years")} />
      <span className={separator}>/</span>
      <input placeholder="mm" className={input} {...getInputProps("months")} />
      <span className={separator}>/</span>
      <input placeholder="dd" className={input} {...getInputProps("days")} />
      <span className={separator}>⋆</span>
      <input placeholder="--" className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input placeholder="--" className={input} {...getInputProps("minutes")} />
      <span className={separator}>:</span>
      <input placeholder="--" className={input} {...getInputProps("seconds")} />
    </div>
  );
};

export default App;
