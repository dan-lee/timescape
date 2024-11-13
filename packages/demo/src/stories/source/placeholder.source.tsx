import { useTimescape } from "timescape/react";
import { input, root, separator } from "../timescape.css";

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
