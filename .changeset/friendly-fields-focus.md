---
"timescape": minor
---

Improve form integration with `focusField(type)`, React-style ref composition
and `autoFocus`, static input attributes on `getInputProps`, and the new
`onInputChange` callback with `empty`/`partial`/`complete` editing state.
The new `onBlur` option and manager `blur` event fire once focus leaves all of
the date's inputs, and `getRootProps` accepts a `ref` that form libraries can
focus.
The `InputState` and `InputChangeDetails` types are exported from every
integration entry point.

`onDateChange` and the manager's `changeDate` event keep their previous timing.
Form libraries can opt into `onInputChange` to receive `null` during an
unfinished edit instead of submitting the previous complete date.
