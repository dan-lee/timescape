import { useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";
import { input, root, separator, wrapper } from "../timescape.css";

const App = () => {
  const { getRootProps, getInputProps, options, update } = useTimescape({
    date: new Date(),
    hour12: false,
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
  });

  return (
    <div className={wrapper}>
      <div {...getRootProps()} className={root}>
        <input className={input} {...getInputProps("hours")} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps("minutes")} />
        <span className={separator}>:</span>
        <input className={input} {...getInputProps("seconds")} />
        {options.hour12 && (
          <input className={input} {...getInputProps("am/pm")} />
        )}
      </div>
      <SetOptions
        enabled={["date", "snapToStep", "wrapAround", "hour12", "digits"]}
        options={options}
        updateFn={update}
      />
    </div>
  );
};

export default App;
