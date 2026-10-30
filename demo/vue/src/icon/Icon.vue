<script setup lang="ts">
import type { IconName } from './icon-name';

const { name } = defineProps<{ name: IconName }>();
</script>

<template>
  <span class="icon" :style="{ '--icon': `url(/icons/${name}.svg)` }" aria-hidden="true" />
</template>

<style scoped>
.icon {
  display: inline-block;
  flex: none;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask: var(--icon) no-repeat center / contain;
  mask: var(--icon) no-repeat center / contain;
  forced-color-adjust: none;
}
</style>
