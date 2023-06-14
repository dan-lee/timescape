<script lang="ts">
  import { createTimescape } from 'timescape/svelte'
  import '../IntegrationDemo.css'
  import { derived, writable } from 'svelte/store'

  const options = writable({
    date: new Date(),
  })

  const { inputProps, rootProps } = createTimescape(options)

  const date = derived(
    options,
    ($options) => $options.date.toLocaleString('en-UK'),
    new Date().toLocaleString('en-UK'),
  )

  date.subscribe((date) => {
    console.log('Date changed to', date)
  })
</script>

<div class="timescape-root" use:rootProps>
  <input use:inputProps={'days'} class="timescape-input" />
  <span class="separator">/</span>
  <input use:inputProps={'months'} class="timescape-input" />
  <span class="separator">/</span>
  <input use:inputProps={'years'} class="timescape-input" />
  <span class="separator">&nbsp;</span>
  <input use:inputProps={'hours'} class="timescape-input" />
  <span class="separator">:</span>
  <input use:inputProps={'minutes'} class="timescape-input" />
  <span class="separator">:</span>
  <input use:inputProps={'seconds'} class="timescape-input" />
</div>
