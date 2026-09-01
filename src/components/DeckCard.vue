<script setup>
import CategoryBadge from './CategoryBadge.vue'

const props = defineProps({
  deck: { type: Object, required: true },
})

defineEmits(['delete'])

</script>

<template>
  <div class="card h-100 border-0">
    <div class="card-body d-flex flex-column">

      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ deck.title }}</h5>
        <CategoryBadge :subject="deck.subject" />
      </div>

      <p v-if="deck.description" class="card-text text-secondary small">{{ deck.description }}</p>

      <div class="mt-auto">
        <hr />
        <div class="d-flex gap-2">
          <router-link :to="`/user/study/${deck.id}`" class="btn btn-sm btn-primary flex-fill">
            Study
          </router-link>
          <router-link :to="`/user/edit/${deck.id}`" class="btn btn-sm btn-outline-secondary">
            Edit
          </router-link>
          <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', deck.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="card-footer text-secondary small border-top-0">
      {{ deck.cards.length }} card{{ deck.cards.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>
