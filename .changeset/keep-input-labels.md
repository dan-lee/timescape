---
"timescape": patch
---

Keep `aria-label` and `aria-labelledby` set on inputs instead of overwriting
them with the field type on every value change. The field type is now only a
fallback label for inputs that have neither.
