---
"timescape": minor
---

**BREAKING**: Refactor to controlled/uncontrolled component pattern

All framework integrations now follow controlled/uncontrolled component patterns, replacing the previous imperative API with a more declarative approach.

**Key Changes:**
- **Controlled mode**: Pass `date` prop with `onDateChange` callback to manage state externally
- **Uncontrolled mode**: Use `defaultDate` for initial value, component manages state internally
- Removed `update` function from all hooks
- Removed `options` object from hook returns (needs to be maintained manually)
- Renamed `onChangeDate` to `onDateChange`
- `null` is the empty date: `date: null` is an empty controlled input, `date: undefined` means uncontrolled. Which mode an input is in is decided on its first render, and switching warns in development.
- Controlled inputs revert user edits unless the parent accepts the new date, but keep the edit in progress: clearing a segment no longer loses the date it is based on
- An external date now reaches the input even while a segment is cleared
- `onDateChange` no longer fires for programmatic updates
- Ranges constrain each other through internal bounds instead of overwriting `minDate`/`maxDate`, and `marry()` returns a function that dissolves the range again

This affects all framework integrations (React, Preact, Vue, Svelte, Solid). See [MIGRATION-v0.9.md](https://github.com/dan-lee/timescape/blob/main/MIGRATION-v0.9.md) for detailed migration examples.
