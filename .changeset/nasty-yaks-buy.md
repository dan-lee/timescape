---
"timescape": minor
---

Added `ampm` to all integration hooks with methods for custom AM/PM controls:

- ampm.value - Getter property that returns current AM/PM value
- ampm.set(value) - Sets AM or PM
- ampm.toggle() - Toggles between AM and PM
- ampm.getSelectProps() - Returns props for HTML select elements