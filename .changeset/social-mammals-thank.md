---
"timescape": minor
---

**BREAKING**: Refactor to controlled/uncontrolled component pattern

All framework integrations now follow controlled/uncontrolled component patterns, replacing the previous imperative API with a more declarative approach.

**Key Changes:**
- **Controlled mode**: Pass `date` prop with `onChangeDate` callback to manage state externally
- **Uncontrolled mode**: Use `defaultDate` for initial value, component manages state internally  
- Removed `update` function from all hooks
- Removed `options` object from hook returns (needs to be maintained manually)
- Controlled behaviour is now consistent across every framework: in controlled mode a user edit is reverted to the `date` prop unless the parent accepts it, and `onChangeDate` fires only for genuine user edits (programmatic/prop-driven updates no longer echo back through it)

This affects all framework integrations (React, Preact, Vue, Svelte, Solid). See [MIGRATION-v0.9.md](https://github.com/dan-lee/timescape/blob/main/MIGRATION-v0.9.md) for detailed migration examples.
