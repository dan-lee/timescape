# timescape

## 0.8.0

### Minor Changes

- [#54](https://github.com/dan-lee/timescape/pull/54) [`0dada18`](https://github.com/dan-lee/timescape/commit/0dada186241b6551879e3722e08fe7204230d14f) Thanks [@dan-lee](https://github.com/dan-lee)! - Add support for milliseconds

  Thanks to @Krzysztof-Kazor for the initial implementation

- [#56](https://github.com/dan-lee/timescape/pull/56) [`cc518ba`](https://github.com/dan-lee/timescape/commit/cc518ba966c4e6717be60f641ca28f6cca9f97ce) Thanks [@dan-lee](https://github.com/dan-lee)! - Added `ampm` to all integration hooks with methods for custom AM/PM controls:

  - ampm.value - Getter property that returns current AM/PM value
  - ampm.set(value) - Sets AM or PM
  - ampm.toggle() - Toggles between AM and PM
  - ampm.getSelectProps() - Returns props for HTML select elements

## 0.7.1

### Patch Changes

- [#48](https://github.com/dan-lee/timescape/pull/48) [`de2958f`](https://github.com/dan-lee/timescape/commit/de2958f4dc1457abe3631e5450b52fc908bb8535) Thanks [@lsmurray](https://github.com/lsmurray)! - export `STOP_EVENT_PROPAGATION`

## 0.7.0

### Minor Changes

- [#42](https://github.com/dan-lee/timescape/pull/42) [`854718e`](https://github.com/dan-lee/timescape/commit/854718e4c98a2e6a1bff34bfa4b6c8b9e6f04680) Thanks [@dan-lee](https://github.com/dan-lee)! - ⚠️ Breaking change:

  This introduces the `disallowPartial` option while simultaneously allowing partial input by default:

  Each segment of the date input can now be set independently, allowing certain parts to remain empty. The `options.date` property will only return a `Date` instance when all segments are set. Otherwise, it will return `undefined`.

  This improvement brings the component closer to standard web behavior, allowing partial date inputs instead of requiring fully completed dates as before.

  **Note**: This is a breaking change, if you want to keep the old behavior, you can to set `disallowPartial` to `true`.

## 0.6.2

### Patch Changes

- [#44](https://github.com/dan-lee/timescape/pull/44) [`8e07ead`](https://github.com/dan-lee/timescape/commit/8e07ead9fe30f16cfdb7be0da6369d786dee06af) Thanks [@dan-lee](https://github.com/dan-lee)! - Added the ability to prevent the default keydown event handling. If you want to handle keydown events yourself, you can now prevent the default behavior by using `onKeyDownCapture` (or the equivalent in your framework) and calling `preventDefault()` in your handler.

  ```tsx
  <input
    onKeyDownCapture={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    }}
  />
  ```

## 0.6.1

### Patch Changes

- [#38](https://github.com/dan-lee/timescape/pull/38) [`74fac65`](https://github.com/dan-lee/timescape/commit/74fac65b95f871e6c37edc6edb0ff16495183903) Thanks [@dan-lee](https://github.com/dan-lee)! - Skip number inputs when meta/ctrl is pressed.

## 0.6.0

### Minor Changes

- [#34](https://github.com/dan-lee/timescape/pull/34) [`7dee0c4`](https://github.com/dan-lee/timescape/commit/7dee0c4b031230a00654d8fc9c96d18318b0d3c9) Thanks [@dan-lee](https://github.com/dan-lee)! - Add a `wheelControl` option that allows to control the input fields with the mouse wheel or touchpad.

## 0.5.2

### Patch Changes

- [#31](https://github.com/dan-lee/timescape/pull/31) [`7a32dad`](https://github.com/dan-lee/timescape/commit/7a32dad8e37dc481d180b5e87169ec0abf3a9304) Thanks [@zanuarmirza](https://github.com/zanuarmirza)! - adding cjs output format

## 0.5.1

### Patch Changes

- [#27](https://github.com/dan-lee/timescape/pull/27) [`24d68fe`](https://github.com/dan-lee/timescape/commit/24d68fe1411de8f1276de8e79a649188618521bf) Thanks [@dan-lee](https://github.com/dan-lee)! - Maintain correct AM/PM value when changing hours in hour12 mode

## 0.5.0

### Minor Changes

- [#23](https://github.com/dan-lee/timescape/pull/23) [`f616faa`](https://github.com/dan-lee/timescape/commit/f616faa325f5d98dc530c030d4d26578adcb01ec) Thanks [@SeanCassiere](https://github.com/SeanCassiere)! - Allow native key events to be passed through in the `keydown`

## 0.4.4

### Patch Changes

- 482d067: Allow switching AM/PM on mobile

## 0.4.3

### Patch Changes

- 7aadd9b: Fix test

## 0.4.2

### Patch Changes

- 22ba9eb: Upgrade packages
- 9201a9b: Always render shadow element next to element

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
