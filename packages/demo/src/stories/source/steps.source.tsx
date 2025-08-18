import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";
import { input, root, separator } from "../timescape.css";

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
