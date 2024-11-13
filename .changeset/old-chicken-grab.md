---
'timescape': minor
---

⚠️ Breaking change:

This introduces the `disallowPartial` option while simultaneously allowing partial input by default:

Each segment of the date input can now be set independently, allowing certain parts to remain empty. The `options.date` property will only return a `Date` instance when all segments are set. Otherwise, it will return `undefined`.

This improvement brings the component closer to standard web behavior, allowing partial date inputs instead of requiring fully completed dates as before.

**Note**: This is a breaking change, if you want to keep the old behavior, you can to set `disallowPartial` to `true`.
