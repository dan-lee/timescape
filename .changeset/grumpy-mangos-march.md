---
'timescape': patch
---

Added the ability to prevent the default keydown event handling. If you want to handle keydown events yourself, you can now prevent the default behavior by using `onKeyDownCapture` (or the equivalent in your framework) and calling `preventDefault()` in your handler.

```tsx
<input
  onKeyDownCapture={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }}
/>
```
