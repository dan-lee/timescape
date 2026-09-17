---
"timescape": patch
---

Fix `getRootProps` ref type in the React integration so its callback returns `void` instead of `void | null`, resolving a TS2322 error when spreading `getRootProps()` onto an element.
