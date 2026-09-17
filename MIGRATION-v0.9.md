# Breaking: Adopt Controlled/Uncontrolled Component Pattern

All framework integrations have been refactored to follow controlled/uncontrolled component patterns,
replacing the previous imperative API with a more declarative approach.

The `options` object is no longer returned from the hook and is now the implementer's responsibility to manage in state or store elsewhere.

## Changes

### API Changes

- **Controlled mode**: Pass `date` prop with `onDateChange` callback to manage state externally
- **Uncontrolled mode**: Use `defaultDate` for initial value, component manages state internally
- Removed `update` function and `options` object from hook returns
- `onChangeDate` is now called `onDateChange`
- The empty date is `null`, not `undefined`: `date: null` is an empty controlled
  input, while `date: undefined` means the input is uncontrolled. Which mode an
  input is in is decided on its first render.
- `marry()` returns a function that dissolves the range again; the integrations
  call it on unmount

## Migration Guide

### React/Preact

**Before:**

```tsx
const { getRootProps, getInputProps, options, update } = useTimescape({
  date: new Date(),
  onChangeDate: (nextDate) => {
    console.log("Date changed to", nextDate);
  },
});

update((prev) => ({ ...prev, date: new Date() }));
```

**After:**

```tsx
const [date, setDate] = useState<Date | null>(new Date());
const { getRootProps, getInputProps } = useTimescape({
  date,
  onDateChange: (nextDate) => {
    console.log("Date changed to", nextDate);
    setDate(nextDate);
  },
});

setDate(new Date());
```

**After (uncontrolled):**

```tsx
const { getRootProps, getInputProps } = useTimescape({
  defaultDate: new Date(),
  onDateChange: (nextDate) => {
    console.log("Date changed to", nextDate);
  },
});
```

### Vue

**Before:**

```vue
<script setup>
const { registerElement, registerRoot, options } = useTimescape({
  date: new Date(),
});

options.value.date = new Date();
</script>
```

**After:**

```vue
<script setup>
const date = ref(new Date());
const { registerElement, registerRoot } = useTimescape({
  date,
  onDateChange: (nextDate) => {
    date.value = nextDate;
  },
});

date.value = new Date();
</script>
```

### Svelte

**Before:**

```svelte
<script>
const { inputProps, rootProps, options } = createTimescape({
  date: new Date(),
});

options.update((prev) => ({ ...prev, date: new Date() }));
</script>
```

**After:**

```svelte
<script>
const date = writable(new Date());
const { inputProps, rootProps } = createTimescape({
  date: $date,
  onDateChange: (nextDate) => {
    date.set(nextDate);
  },
});

date.set(new Date());
</script>
```

### Solid

**Before:**

```tsx
const { getInputProps, getRootProps, options, update } = useTimescape({
  date: new Date(),
});

update("date", new Date());
// or
update({ date: new Date() });
```

**After:**

```tsx
const [date, setDate] = createSignal(new Date());
const { getInputProps, getRootProps } = useTimescape({
  date: date(),
  onDateChange: (nextDate) => {
    setDate(nextDate);
  },
});

setDate(new Date());
```

### Range Components

**Before:**

```tsx
const { getRootProps, from, to } = useTimescapeRange({
  from: { date: new Date("2000-01-01") },
  to: { date: new Date() },
});

console.log(from.options.date);
```

**After:**

```tsx
const [fromDate, setFromDate] = useState<Date | null>(new Date("2000-01-01"));
const [toDate, setToDate] = useState<Date | null>(new Date());

const { getRootProps, from, to } = useTimescapeRange({
  from: { date: fromDate, onDateChange: setFromDate },
  to: { date: toDate, onDateChange: setToDate },
});

console.log(fromDate);
```

## Breaking Changes

- Updated all framework integrations to use controlled/uncontrolled component patterns
- Removed `update` function from all hooks
- Removed `options` object from hook returns
- Renamed `onChangeDate` to `onDateChange`, which now reports `null` instead of
  `undefined` for an empty or incomplete date
- `date` and `defaultDate` accept `Date | null`; pass `null`, not `undefined`,
  to empty a controlled input
- Ranges constrain each other through internal bounds instead of writing
  `minDate`/`maxDate` on the other end, so your own `minDate`/`maxDate` are left
  alone

## Editing state in controlled mode

A controlled input reverts an edit you do not accept, but it does not throw away
what the user is in the middle of. Clearing a segment keeps the date that entry
is based on, so re-typing the segment restores the rest of the date rather than
falling back to today. Writing the *same* date back leaves the edit in place;
writing a *different* date replaces what is on screen.
