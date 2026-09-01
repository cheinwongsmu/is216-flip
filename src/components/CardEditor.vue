<script setup>
const props = defineProps({
  card: { type: Object, required: true },
  index: { type: Number, required: true },
})

const emit = defineEmits(['update', 'delete'])

function update(field, value) {
  emit('update', { ...props.card, [field]: value })
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-secondary">Card {{ index + 1 }}</span>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="emit('delete')">
          Delete
        </button>
      </div>
      <div class="mb-3">
        <label class="form-label small">Front (Question / Term)</label>
        <textarea class="form-control" rows="3" placeholder="Enter a question." :value="card.front"
          @input="update('front', $event.target.value)"></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label small">Back (Answer / Definition)</label>
        <textarea class="form-control" rows="3" placeholder="Enter the answer to the question above." :value="card.back"
          @input="update('back', $event.target.value)"></textarea>
      </div>
    </div>
  </div>
</template>
