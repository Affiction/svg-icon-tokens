<script setup lang="ts">
import Icon from './icon/Icon.vue';
</script>

<template>
  <h2>Vue: &lt;Icon&gt;</h2>
  <section>
    <Icon name="star" class="big red" />
    <button><Icon name="search" /> Search</button>
    <button aria-label="Delete"><Icon name="trash" /></button>
  </section>
</template>
