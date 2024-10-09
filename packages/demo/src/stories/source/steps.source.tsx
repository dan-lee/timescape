import { useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";
import { input, root, separator } from "../timescape.css";

const App = () => {
  // 👇 steps for the input fields
  const steps = {
    hours: 1,
    minutes: 15,
    seconds: 30,
  };

  const { getRootProps, getInputProps, options, update } = useTimescape({
    date: new Date(),
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
        enabled={["date", "snapToStep", "wrapAround", "hour12", "digits"]}
        options={options}
        updateFn={update}
      />
    </>
  );
};

export default App;
