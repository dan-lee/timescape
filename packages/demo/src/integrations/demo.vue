<template>
  <div class="timescape-root" :ref="registerRoot()">
    <input :ref="registerElement('days')" class="timescape-input" />
    <span class="separator">/</span>
    <input :ref="registerElement('months')" class="timescape-input" />
    <span class="separator">/</span>
    <input :ref="registerElement('years')" class="timescape-input" />
    <span class="separator">&nbsp;</span>
    <input :ref="registerElement('hours')" class="timescape-input" />
    <span class="separator">:</span>
    <input :ref="registerElement('minutes')" class="timescape-input" />
    <span class="separator">:</span>
    <input :ref="registerElement('seconds')" class="timescape-input" />
  </div>
</template>

<script lang="ts" setup>
import { useTimescape, $NOW, type UseTimescapeOptions } from 'timescape/vue'
import { ref, computed, watchEffect, reactive } from 'vue'

const date = ref(new Date())
const dateString = computed(() => date.value.toLocaleString('en-UK'))

watchEffect(() => {
  console.log('Date changed to', date.value)
})

const options = reactive({
  date,
} as UseTimescapeOptions)

const { registerElement, registerRoot } = useTimescape(options)
</script>
