# demo

## 1.3.2

### Patch Changes

- Updated dependencies [[`8e07ead`](https://github.com/dan-lee/timescape/commit/8e07ead9fe30f16cfdb7be0da6369d786dee06af)]:
  - timescape@0.6.2

## 1.3.1

### Patch Changes

- Updated dependencies [[`74fac65`](https://github.com/dan-lee/timescape/commit/74fac65b95f871e6c37edc6edb0ff16495183903)]:
  - timescape@0.6.1

## 1.3.0

### Minor Changes

- [#34](https://github.com/dan-lee/timescape/pull/34) [`7dee0c4`](https://github.com/dan-lee/timescape/commit/7dee0c4b031230a00654d8fc9c96d18318b0d3c9) Thanks [@dan-lee](https://github.com/dan-lee)! - Add a `wheelControl` option that allows to control the input fields with the mouse wheel or touchpad.

### Patch Changes

- Updated dependencies [[`7dee0c4`](https://github.com/dan-lee/timescape/commit/7dee0c4b031230a00654d8fc9c96d18318b0d3c9)]:
  - timescape@0.6.0

## 1.2.7

### Patch Changes

- Updated dependencies [[`7a32dad`](https://github.com/dan-lee/timescape/commit/7a32dad8e37dc481d180b5e87169ec0abf3a9304)]:
  - timescape@0.5.2

## 1.2.6

### Patch Changes

- Updated dependencies [[`24d68fe`](https://github.com/dan-lee/timescape/commit/24d68fe1411de8f1276de8e79a649188618521bf)]:
  - timescape@0.5.1

## 1.2.5

### Patch Changes

- Updated dependencies [[`f616faa`](https://github.com/dan-lee/timescape/commit/f616faa325f5d98dc530c030d4d26578adcb01ec)]:
  - timescape@0.5.0

## 1.2.4

### Patch Changes

- Updated dependencies [482d067]
  - timescape@0.4.4

## 1.2.3

### Patch Changes

- Updated dependencies [7aadd9b]
  - timescape@0.4.3

## 1.2.2

### Patch Changes

- 22ba9eb: Upgrade packages
- Updated dependencies [22ba9eb]
- Updated dependencies [9201a9b]
  - timescape@0.4.2

## 1.2.1

### Patch Changes

- Updated dependencies [aa39a3d]
  - timescape@0.4.1

## 1.2.0

### Minor Changes

- 2183515: # Features

  ## Ranges

  `timescape` now supports ranges for the date/time inputs. This means a user can select a start and end. This is useful for things like booking systems, where you want to allow the user to select a range of dates.

  This is achieved by using two `timescape` instances, one for the start and one for the end. You can set their options independently, and they return the respective options and update functions in the `from` and `to` objects.

  Example usage (this works similar for all supported libraries):

  ```tsx
  import { useTimescapeRange } from 'timescape/react'
  // Use `createTimescapeRange` for Svelte

  const { getRootProps, from, to } = useTimescapeRange({
    from: { date: new Date('2000-01-01') },
    to: { date: new Date() },
  })

  return (
    <div {...getRootProps()}>
      <div>
        <input {...from.getInputProps('days')} />
        <span>/</span>
        <input {...from.getInputProps('months')} />
        <span>/</span>
        <input {...from.getInputProps('years')} />
      </div>
      <div>
        <input {...to.getInputProps('days')} />
        <span>/</span>
        <input {...to.getInputProps('months')} />
        <span>/</span>
        <input {...to.getInputProps('years')} />
      </div>
    </div>
  )
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
  })
  const { ...rest } = useTimescape(options)

  const handleChange = () => {
    setOptions((prev) => ({ ...prev, date: new Date() }))
  }
  ```

  <td>

  ```tsx
  const { options, update, ...rest } = useTimescape({
    date: new Date(),
  })

  const handleChange = () => {
    update((prev) => ({ ...prev, date: new Date() }))
  }
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
  const options = useSignal({ date: new Date() })
  const { ...rest } = useTimescape(options)

  const handleChange = () => {
    options.value = {
      ...options.value,
      date: new Date(),
    }
  }
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  })

  const handleChange = () => {
    options.value = {
      ...options.value,
      date: new Date(),
    }
  }
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
  })
  const { ...rest } = useTimescape(options)

  const handleChange = () => {
    options.update((options) => ({
      ...options,
      date: new Date(),
    }))
  }
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  })

  const handleChange = () => {
    options.update((options) => ({
      ...options,
      date: new Date(),
    }))
  }
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
  })
  const { ...rest } = useTimescape(options)

  const handleChange = () => {
    setOptions('date', new Date())
    // or object notation: setOptions({ … })
  }
  ```

  <td>

  ```tsx
  const { options, update, ...rest } = useTimescape({
    date: new Date(),
  })

  const handleChange = () => {
    update('date', new Date())
    // or object notation: update({ … })
  }
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
  const date = ref(new Date())
  const options = reactive({ date })
  const { ...rest } = useTimescape(options)

  // Set later:
  // <button @click="date = new Date()">
  ```

  <td>

  ```tsx
  const { options, ...rest } = useTimescape({
    date: new Date(),
  })

  // Set later:
  // <button @click="options.date = new Date()">
  ```

  </table>
  </details>

### Patch Changes

- Updated dependencies [2183515]
  - timescape@0.4.0

## 1.1.0

### Minor Changes

- 68cd9f1: Add `snapToStep` option

### Patch Changes

- Updated dependencies [68cd9f1]
  - timescape@0.3.0

## 1.0.1

### Patch Changes

- Updated dependencies [f3e2551]
  - timescape@0.2.1
