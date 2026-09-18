import { type Dispatch, Fragment, type SetStateAction, useState } from "react";
import type { Options } from "timescape/react";

const fieldset =
  "fixed right-0 top-0 grid translate-x-[-20px] translate-y-[10px] grid-cols-[max-content_1fr] items-center justify-items-start gap-x-4 gap-y-1 overflow-hidden rounded-[4px] border border-[#7182ec] bg-white/60 px-6 py-4 text-[14px] data-[expanded=false]:max-h-0 data-[expanded=false]:cursor-pointer data-[expanded=false]:border-black/20 data-[expanded=false]:py-0";
const optionsInput =
  "rounded-[10px] border border-[#bbb] px-[5px] py-[3px] transition-all duration-100 select-none focus-within:border-[#7182ec] focus-within:[outline:1px_solid_#7182ec] invalid:border-[#ce4455] invalid:[outline:1px_solid_#ce4455]";
const checkbox =
  "m-0 grid h-[14px] w-[14px] cursor-pointer appearance-none place-content-center rounded-[4px] border border-[#bbb] bg-transparent font-[inherit] text-current outline-none focus:border-[#7182ec] checked:before:h-[8px] checked:before:w-[8px] checked:before:rounded-[2px] checked:before:bg-[#7182ec] checked:before:content-['']";
const label = "w-full cursor-pointer font-mono text-[90%] text-[#444]";
const button =
  "cursor-pointer appearance-none rounded-[4px] border border-[#bbb] bg-[#eee] px-2 py-1";

const toDateTimeLocal = (date: Date) => {
  const YMD = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

  const HMS = [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join(":");

  return `${YMD}T${HMS}`;
};

const ALL_OPTIONS = [
  "date",
  "minDate",
  "maxDate",
  "hour12",
  "digits",
  "wrapAround",
  "snapToStep",
  "wheelControl",
  "disallowPartial",
] as const;

type UpdateFn = Dispatch<SetStateAction<Options>>;
type PossibleOptions = (typeof ALL_OPTIONS)[number];

export const SetOptions = ({
  enabled,
  options,
  updateFn,
}: {
  enabled?: PossibleOptions[];
  options: Options;
  updateFn: UpdateFn;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <fieldset
      className={fieldset}
      data-expanded={isExpanded}
      onClick={() => {
        if (isExpanded) return;
        setIsExpanded(true);
      }}
    >
      <legend
        style={{ cursor: "pointer", paddingInline: "7px" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "⏷" : "⏵"} Options
      </legend>
      <div
        style={{
          display: "contents",
          visibility: isExpanded ? undefined : "hidden",
        }}
      >
        {(enabled ?? ALL_OPTIONS).map((optionName) => (
          <Fragment key={optionName}>
            <label className={label} htmlFor={`input-${optionName}`}>
              {optionName}
            </label>
            <InputField
              optionName={optionName}
              value={options[optionName]}
              updateFn={updateFn}
            />
          </Fragment>
        ))}
      </div>
      <button
        type="button"
        className={button}
        onClick={() => updateFn({ date: new Date() })}
      >
        Reset
      </button>
    </fieldset>
  );
};

const InputField = ({
  optionName,
  value,
  updateFn,
}: {
  optionName: PossibleOptions;
  value: Options[PossibleOptions];
  updateFn: UpdateFn;
}) => {
  switch (optionName) {
    case "date":
    case "minDate":
    case "maxDate":
      return (
        <input
          id={`input-${optionName}`}
          className={optionsInput}
          type="datetime-local"
          value={value instanceof Date ? toDateTimeLocal(value) : ""}
          style={{ width: "100%" }}
          onChange={(e) => {
            const date = new Date(e.target.value);

            if (Number.isNaN(date.getTime())) {
              return window.alert(
                `! Sorry to interrupt: This is an invalid date.\n\nBy the way: This doesn't happen with timescape :)`,
              );
            }
            updateFn((p) => ({ ...p, [optionName]: date }));
          }}
        />
      );
    case "digits":
      return (
        <select
          id={`input-${optionName}`}
          className={optionsInput}
          value={value as string}
          onChange={(e) => {
            const value = e.target.value as Options["digits"];
            updateFn((p) => ({ ...p, [optionName]: value }));
          }}
        >
          <option value="2-digit">2-digit</option>
          <option value="numeric">numeric</option>
        </select>
      );
    case "wrapAround":
    case "snapToStep":
    case "hour12":
    case "wheelControl":
    case "disallowPartial":
      return (
        <input
          id={`input-${optionName}`}
          className={checkbox}
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => {
            const value = e.target.checked;
            updateFn((p) => ({ ...p, [optionName]: value }));
          }}
        />
      );
  }
};
