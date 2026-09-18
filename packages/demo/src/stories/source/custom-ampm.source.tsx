import { useTimescape } from "timescape/react";

const root =
  "flex w-fit cursor-text select-none items-center gap-0.5 rounded-[10px] border border-[#bbb] bg-white p-[5px] transition-all duration-100 focus-within:border-[#6c70ff] focus-within:[outline:1px_solid_#6c70ff]";
const input =
  "h-fit max-w-[50px] border-none text-lg tabular-nums caret-transparent outline-none select-none selection:bg-transparent focus:rounded-md focus:bg-[#6c70ff] focus:px-0.5 focus:text-white focus:placeholder:text-white/80";
const separator = "m-0 text-[80%] text-[#8c8c8c]";

const SelectExample = () => {
  const { getInputProps, getRootProps, ampm } = useTimescape({
    defaultDate: new Date(),
  });

  return (
    <div className={root} {...getRootProps()}>
      <input className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("minutes")} />
      <span className={separator}> </span>
      <select {...ampm.getSelectProps()} className={input}>
        <option value="am">AM</option>
        <option value="pm">PM</option>
      </select>
    </div>
  );
};

const RadioExample = () => {
  const { getInputProps, getRootProps, ampm } = useTimescape({
    defaultDate: new Date(),
  });

  return (
    <div className={root} {...getRootProps()}>
      <input className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("minutes")} />
      <span className={separator}> </span>
      <div style={{ display: "flex", gap: "5px" }}>
        <label>
          <input
            type="radio"
            name="ampm-radio"
            value="am"
            checked={ampm.value === "am"}
            onChange={() => ampm.set("am")}
          />
          AM
        </label>
        <label>
          <input
            type="radio"
            name="ampm-radio"
            value="pm"
            checked={ampm.value === "pm"}
            onChange={() => ampm.set("pm")}
          />
          PM
        </label>
      </div>
    </div>
  );
};

const ToggleButtonExample = () => {
  const { getInputProps, getRootProps, ampm } = useTimescape({
    defaultDate: new Date(),
  });

  return (
    <div className={root} {...getRootProps()}>
      <input className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("minutes")} />
      <span className={separator}> </span>
      <button
        type="button"
        onClick={ampm.toggle}
        style={{
          padding: "5px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {ampm.value === "am" ? "☀️ AM" : "🌙 PM"}
      </button>
    </div>
  );
};

const CheckboxExample = () => {
  const { getInputProps, getRootProps, ampm } = useTimescape({
    defaultDate: new Date(),
  });

  return (
    <div className={root} {...getRootProps()}>
      <input className={input} {...getInputProps("hours")} />
      <span className={separator}>:</span>
      <input className={input} {...getInputProps("minutes")} />
      <span className={separator}> </span>
      <label>
        <input
          type="checkbox"
          checked={ampm.value === "pm"}
          onChange={ampm.toggle}
        />
        PM Mode
      </label>
    </div>
  );
};

const CustomAmPmExample = () => (
  <div>
    <h3>With HTML select</h3>
    <SelectExample />

    <h3>With Radio Buttons</h3>
    <RadioExample />

    <h3>With Toggle Button</h3>
    <ToggleButtonExample />

    <h3>With Checkbox</h3>
    <CheckboxExample />
  </div>
);

export default CustomAmPmExample;
