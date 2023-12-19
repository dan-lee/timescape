import { DPUseDatePicker } from '@rehookify/datepicker'
import { bar, dayItem, wrapper } from './calendar.css'

export const Calendar = ({ state }: { state: ReturnType<DPUseDatePicker> }) => {
  const {
    data: { calendars },
  } = state
  const calendar = calendars[0]!

  return (
    <div>
      <div className={bar}>
        <button
          style={{ border: 'none', cursor: 'pointer' }}
          {...state.propGetters.subtractOffset({ months: 1 })}
        >
          ◄
        </button>
        <span>
          {calendar.month}, {calendar.year}
        </span>
        <button
          style={{ border: 'none', cursor: 'pointer' }}
          {...state.propGetters.addOffset({ months: 1 })}
        >
          ►
        </button>
      </div>
      <div className={wrapper}>
        {calendar.days.map((day, i) => (
          <div
            key={i}
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
  )
}
