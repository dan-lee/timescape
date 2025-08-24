# Breaking:Adopt Controlled/Uncontrolled Component Pattern

All framework integrations have been refactored to follow controlled/uncontrolled component patterns,
replacing the previous imperative API with a more declarative approach.

The `options` object is no longer returned from the hook and is now the implementer's responsibility to manage in state or store elsewhere.

## Changes

### API Changes

- **Controlled mode**: Pass `date` prop with `onChangeDate` callback to manage state externally
- **Uncontrolled mode**: Use `defaultDate` for initial value, component manages state internally
- Removed `update` function and `options` object from hook returns

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
const [date, setDate] = useState(new Date());
const { getRootProps, getInputProps } = useTimescape({
  date,
  onChangeDate: (nextDate) => {
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
  onChangeDate: (nextDate) => {
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
  onChangeDate: (nextDate) => {
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
  onChangeDate: (nextDate) => {
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
  onChangeDate: (nextDate) => {
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
const [fromDate, setFromDate] = useState(new Date("2000-01-01"));
const [toDate, setToDate] = useState(new Date());

const { getRootProps, from, to } = useTimescapeRange({
  from: { date: fromDate, onChangeDate: setFromDate },
  to: { date: toDate, onChangeDate: setToDate },
});

console.log(fromDate);
```

## Breaking Changes

- Updated all framework integrations to use controlled/uncontrolled component patterns
- Removed `update` function from all hooks
- Removed `options` object from hook returns
