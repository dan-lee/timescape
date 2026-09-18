import type { DPUseDatePicker } from "@rehookify/datepicker";

const bar = "flex items-center justify-between p-2";
const wrapper =
  "grid grid-cols-7 gap-px rounded-[0.25rem] shadow-[0_0_0_1px_#ccc,0_7px_29px_0_rgba(100,100,111,0.2)]";
const dayItem =
  "flex h-[35px] w-[35px] cursor-pointer items-center justify-center bg-white text-[95%] text-[#333] tabular-nums transition-[background-color,outline-color] duration-200 [outline:1px_solid_#dedcdc] first:rounded-tl-[0.25rem] last:rounded-br-[0.25rem] [&:nth-child(7)]:rounded-tr-[0.25rem] [&:nth-child(36)]:rounded-bl-[0.25rem] hover:z-[1] hover:bg-[#7182ec] hover:text-white hover:[outline-color:#7182ec] data-[current-month=false]:bg-[#f5f5f5] data-[current-month=false]:text-[#7c7c7c] data-[selected=true]:z-[1] data-[selected=true]:bg-[#6c70ff] data-[selected=true]:text-white data-[selected=true]:[outline-color:#6c70ff] data-[range=in-range]:z-[1] data-[range=in-range]:bg-[#6c70ff] data-[range=in-range]:text-white data-[range=in-range]:brightness-95 data-[range=in-range]:[outline-color:#6c70ff] data-[range=will-be-in-range]:z-[1] data-[range=will-be-in-range]:bg-[#eaeaea] data-[range=will-be-in-range]:text-[#555] data-[range=will-be-in-range]:[outline-color:#ccc]";

export const Calendar = ({ state }: { state: ReturnType<DPUseDatePicker> }) => {
  const {
    data: { calendars },
  } = state;

  const calendar = calendars[0];

  if (!calendar) return null;

  return (
    <div>
      <div className={bar}>
        <button
          style={{ border: "none", cursor: "pointer" }}
          {...state.propGetters.subtractOffset({ months: 1 })}
        >
          ◄
        </button>
        <span>
          {calendar.month}, {calendar.year}
        </span>
        <button
          style={{ border: "none", cursor: "pointer" }}
          {...state.propGetters.addOffset({ months: 1 })}
        >
          ►
        </button>
      </div>
      <div className={wrapper}>
        {calendar.days.map((day) => (
          <div
            key={`${day.$date.getMonth()}/${day.$date.getDate()}`}
            className={dayItem}
            data-current-month={day.inCurrentMonth}
            data-selected={day.selected}
            data-range={day.range}
            {...state.propGetters.dayButton(day)}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
};
