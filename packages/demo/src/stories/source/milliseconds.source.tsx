import { useState } from "react";
import { type Options, useTimescape } from "timescape/react";
import { SetOptions } from "../SetOptions";
import { input, root, separator, wrapper } from "../timescape.css";

const App = () => {
  const [options, setOptions] = useState<Options>({
    date: new Date(),
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
  });
  const { getRootProps, getInputProps } = useTimescape(options);

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
