---
"timescape": patch
---

Fix: clearing one end of a range no longer limits the other

Emptying the `to` input left `from` stuck at the date you had just removed, and emptying `from` did the same to `to`. An empty input now stops limiting the other one.
