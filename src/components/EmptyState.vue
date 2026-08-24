<script setup>
defineProps({
  message: { type: String, default: 'Nothing here yet.' },
})
</script>


<template>
  <div class="text-center py-5">
    <h5 class="text-muted">{{ message }}</h5>
    <slot />
  </div>
</template>
