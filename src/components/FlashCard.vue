<script setup>
defineProps({
  front: { type: String, required: true },
  back: { type: String, required: true },
  isFlipped: { type: Boolean, default: false },
})

defineEmits(['flip'])
</script>

<template>
  <div class="card-container" @click="$emit('flip')">
    <div class="card-inner" :class="{ flipped: isFlipped }">
      <div class="card-front">
        <div class="text-uppercase fs-6 opacity-50">Question</div>
        <p>{{ front }}</p>
      </div>
      <div class="card-back">
        <div class="text-uppercase fs-6 opacity-50">Answer</div>
        <p>{{ back }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-container {
  width: 100%;
  max-width: 500px;
  height: 250px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  font-size: 1.5rem;
  text-align: center;
}

.card-front {
  background: #ffffff;
  color: #2b2d42;
  border: 2px solid #e0e0e0;
}

.card-back {
  background: #1e40af;
  color: #ffffff;
  transform: rotateY(180deg);
}
</style>
