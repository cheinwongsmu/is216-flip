<script setup>
import { computed } from 'vue'

const props = defineProps({
  subject: { type: String, required: true },
})

const badgeClass = computed(() => {
  const map = {
    HTML: 'bg-warning',
    CSS: 'bg-info',
    JavaScript: 'bg-primary',
    Vue: 'bg-success',
    General: 'bg-secondary',
  }
  return map[props.subject]
})
</script>

<template>
  <span class="badge" :class="badgeClass">{{ subject }}</span>
</template>
