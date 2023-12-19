<script lang="ts">
  import { createTimescape, createTimescapeRange } from 'timescape/svelte'
  import { derived } from 'svelte/store'
  import '../IntegrationDemo.css'

  const { inputProps, rootProps, options } = createTimescape({
    date: new Date(),
    maxDate: new Date('2024-12-12'),
  })

  const date = derived(options, ($o) => $o.date)

  date.subscribe((date) => {
    console.log('Date changed to', date?.toLocaleString())
  })

  const { from, to, rangeRootProps } = createTimescapeRange({
    from: { date: new Date() },
    to: { date: new Date('2024-12-12') },
  })
</script>

<div>
  Simple date time:
  <div class="timescape-root" use:rootProps>
    <input use:inputProps={'years'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:inputProps={'months'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:inputProps={'days'} class="timescape-input" />
    <span class="separator">&nbsp;</span>
    <input use:inputProps={'hours'} class="timescape-input" />
    <span class="separator">:</span>
    <input use:inputProps={'minutes'} class="timescape-input" />
    <span class="separator">:</span>
    <input use:inputProps={'seconds'} class="timescape-input" />
  </div>
  <br />
  Range:
  <div class="timescape-root" use:rangeRootProps>
    <input use:from.inputProps={'years'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:from.inputProps={'months'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:from.inputProps={'days'} class="timescape-input" />
    <span class="separator">&ndash;</span>
    <input use:to.inputProps={'years'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:to.inputProps={'months'} class="timescape-input" />
    <span class="separator">/</span>
    <input use:to.inputProps={'days'} class="timescape-input" />
  </div>
</div>
