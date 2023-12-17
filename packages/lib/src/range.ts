import { type TimescapeManager } from './index'
import { STOP_EVENT_PROPAGATION } from './util'

export const marry = (from: TimescapeManager, to: TimescapeManager) => {
  from.on('focusWrap', (type) => {
    to.focusField(type === 'start' ? -1 : 0)
  })
  from.on('changeDate', (date) => {
    if (!date || !to.date) return

    // don't allow the from date to be after the to date
    if (date > to.date) {
      from.date = to.date
      return STOP_EVENT_PROPAGATION
    }
  })

  to.on('focusWrap', (type) => {
    from.focusField(type === 'end' ? 0 : -1)
  })
  to.on('changeDate', (date) => {
    if (!date || !from.date) return

    // don't allow the to date to be before the from date
    if (date < from.date) {
      to.date = from.date
      return STOP_EVENT_PROPAGATION
    }
  })
}
