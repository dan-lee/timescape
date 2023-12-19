<template>
  Simple date time:
  <div class="timescape-root" :ref="registerRoot()">
    <input :ref="registerElement('years')" class="timescape-input" />
    <span class="separator">/</span>
    <input :ref="registerElement('months')" class="timescape-input" />
    <span class="separator">/</span>
    <input :ref="registerElement('days')" class="timescape-input" />
    <span class="separator">&nbsp;</span>
    <input :ref="registerElement('hours')" class="timescape-input" />
    <span class="separator">:</span>
    <input :ref="registerElement('minutes')" class="timescape-input" />
    <span class="separator">:</span>
    <input :ref="registerElement('seconds')" class="timescape-input" />
  </div>
  <br />
  Range:
  <div class="timescape-root" :ref="registerRangeRoot()">
    <input class="timescape-input" :ref="from.registerElement('years')" />
    <span class="separator">/</span>
    <input class="timescape-input" :ref="from.registerElement('months')" />
    <span class="separator">/</span>
    <input class="timescape-input" :ref="from.registerElement('days')" />
    <span class="separator">–</span>
    <input class="timescape-input" :ref="to.registerElement('years')" />
    <span class="separator">/</span>
    <input class="timescape-input" :ref="to.registerElement('months')" />
    <span class="separator">/</span>
    <input class="timescape-input" :ref="to.registerElement('days')" />
  </div>
</template>

<script lang="ts" setup>
import { useTimescape, useTimescapeRange } from 'timescape/vue'
import { watchEffect } from 'vue'

const Y2K38 = new Date((2 ** 31 - 1) * 1000)

const { registerElement, registerRoot, options } = useTimescape({
  date: new Date(),
  maxDate: Y2K38,
})

watchEffect(() => {
  console.log('Date changed to', options.value.date)
})

const { from, to, registerRangeRoot } = useTimescapeRange({
  from: { date: new Date() },
  to: { date: new Date('2024-12-12') },
})
</script>
