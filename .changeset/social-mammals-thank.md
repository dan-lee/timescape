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

This affects all framework integrations (React, Preact, Vue, Svelte, Solid). See [MIGRATION-v0.9.md](./MIGRATION-v0.9.md) for detailed migration examples.
