# timescape

## 0.4.1

### Patch Changes

- aa39a3d: Fix leaky shadow elements

## 0.4.0

### Minor Changes

- 2183515: # Features

  ## Ranges

  `timescape` now supports ranges for the date/time inputs. This means a user can select a start and end. This is useful for things like booking systems, where you want to allow the user to select a range of dates.

  This is achieved by using two `timescape` instances, one for the start and one for the end. You can set their options independently, and they return the respective options and update functions in the `from` and `to` objects.

  Example usage (this works similar for all supported libraries):

  ```tsx
  import { useTimescapeRange } from "timescape/react";
  // Use `createTimescapeRange` for Svelte

  const { getRootProps, from, to } = useTimescapeRange({
    from: { date: new Date("2000-01-01") },
    to: { date: new Date() },
  });

  return (
    <div {...getRootProps()}>
      <div>
        <input {...from.getInputProps("days")} />
        <span>/</span>
        <input {...from.getInputProps("months")} />
        <span>/</span>
        <input {...from.getInputProps("years")} />
      </div>
      <div>
        <input {...to.getInputProps("days")} />
        <span>/</span>
        <input {...to.getInputProps("months")} />
        <span>/</span>
        <input {...to.getInputProps("years")} />
      </div>
    </div>
  );
  ```

  # Breaking changes

  ## State/Signal/Store passing

  It's not necessary to pass down your own states/signals/stores to `timescape` anymore.
  They are being created for you and returned (together with an update function if necessary). This makes things way easier to handle on `timescape`’s side and should be easy to migrate to.

  Updating the state is followed by the libraries' conventions. See the examples down below.

  <details open>
  <summary><h3>Migration in React</h3></summary>

  <table>
  <tr>
  <th>Before
  <th>After
  <tr>
  <td>

  ```tsx
  const [options, setOptions] = useState({
    date: new Date(),
  });
  const { ...rest } = useTimescape(options);

  const handleChange = () => {
    setOptions((prev) => ({ ...prev, date: new Date() }));
  };
  ```

  <td>

  ```tsx
  const { options, update, ...rest } = useTimescape({
    date: new Date(),
  });

  const handleChange = () => {
    update((prev) => ({ ...prev, date: new Date() }));
  };
  ```

  </table>

  </details>

  <details>
  <summary><h3>Migration in Preact</h3></summary>

  <table>

  <tr>
  <th>Before
  <th>After
  <tr>
  <td>

  ```tsx
  const options = useSignal({ date: new Date() });
  const { ...rest } = useTimescape(options);

  const handleChange = () => {
    options.value = {
      ...options.value,
      date: new Date(),
    };
  };
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  });

  const handleChange = () => {
    options.value = {
      ...options.value,
      date: new Date(),
    };
  };
  ```

  </table>

  </details>

  <details>
  <summary><h3>Migration in Svelte</h3></summary>

  <table>
  <tr>
  <th>Before
  <th>After
  <tr>
  <td>

  ```tsx
  const options = writable({
    date: new Date(),
  });
  const { ...rest } = useTimescape(options);

  const handleChange = () => {
    options.update((options) => ({
      ...options,
      date: new Date(),
    }));
  };
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  });

  const handleChange = () => {
    options.update((options) => ({
      ...options,
      date: new Date(),
    }));
  };
  ```

  </table>
  </details>

  <details>
  <summary><h3>Migration in Solid</h3></summary>

  <table>
  <tr>
  <th>Before
  <th>After
  <tr>
  <td>

  ```tsx
  const [options, setOptions] = createSignal({
    date: new Date(),
  });
  const { ...rest } = useTimescape(options);

  const handleChange = () => {
    setOptions("date", new Date());
    // or object notation: setOptions({ … })
  };
  ```

  <td>

  ```tsx
  const { options, update, ...rest } = useTimescape({
    date: new Date(),
  });

  const handleChange = () => {
    update("date", new Date());
    // or object notation: update({ … })
  };
  ```

  </table>
  </details>

  <details>
  <summary><h3>Migration in Vue</h3></summary>

  <table>
  <tr>
  <th>Before
  <th>After
  <tr>
  <td>

  ```tsx
  const date = ref(new Date());
  const options = reactive({ date });
  const { ...rest } = useTimescape(options);

  // Set later:
  // <button @click="date = new Date()">
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  });

  // Set later:
  // <button @click="options.date = new Date()">
  ```

  </table>
  </details>

## 0.3.0

### Minor Changes

- 68cd9f1: Add `snapToStep` option

## 0.2.1

### Patch Changes

- f3e2551: Set value from intermediate value when focus is lost or up/down arrow keys are used.
