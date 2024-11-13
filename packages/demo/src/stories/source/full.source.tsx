import { useTimescape } from "timescape/react";
import { input, root, separator } from "../timescape.css";

const App = () => {
  const { getRootProps, getInputProps, options } = useTimescape({
    // Edit these options in real-time 👇
    date: new Date(),
    disallowPartial: false,
    minDate: undefined,
    maxDate: undefined,
    hour12: false,
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
      {options.hour12 && (
        <input className={input} {...getInputProps("am/pm")} />
      )}
    </div>
  );
};

export default App;
