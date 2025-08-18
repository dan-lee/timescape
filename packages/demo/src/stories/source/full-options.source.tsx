import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";
import { input, root, separator, wrapper } from "../timescape.css";

const App = () => {
  const [options, setOptions] = useState<Options>({
    minDate: undefined,
    maxDate: undefined,
    hour12: false,
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
    wheelControl: true,
    disallowPartial: false,
  });

  const { getRootProps, getInputProps } = useTimescape({
    ...options,
    defaultDate: new Date(),
    onChange: (date) => setOptions((p) => ({ ...p, date })),
  });

  return (
    <div className={wrapper}>
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
      <SetOptions options={options} updateFn={setOptions} />
    </div>
  );
};

export default App;
