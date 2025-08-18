<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
import { useTimescape, useTimescapeRange } from "timescape/vue";
import { ref } from "vue";

const date = ref(new Date());

const { registerElement, registerRoot } = useTimescape({
  date,
  onChange: (newDate) => {
    console.log("Date changed to", newDate);
  },
});

const { from, to, registerRangeRoot } = useTimescapeRange({
  from: { defaultDate: new Date() },
  to: { defaultDate: new Date("2024-12-12") },
});
</script>
