import { useTimescape } from "timescape/react";
import { input, root, separator } from "../timescape.css";

const App = () => {
  const { getRootProps, getInputProps } = useTimescape({
    date: undefined,
  });

  return (
    <div {...getRootProps()} className={root}>
      <input placeholder="YYYY" className={input} {...getInputProps("years")} />
      <span className={separator}>/</span>
      <input placeholder="MM" className={input} {...getInputProps("months")} />
      <span className={separator}>/</span>
      <input placeholder="DD" className={input} {...getInputProps("days")} />
      <span className={separator}>⋆</span>
      <input placeholder="hh" className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input placeholder="mm" className={input} {...getInputProps("minutes")} />
      <span className={separator}>:</span>
      <input placeholder="ss" className={input} {...getInputProps("seconds")} />
    </div>
  );
};

export default App;
