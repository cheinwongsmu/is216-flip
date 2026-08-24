<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeckStore } from '../../stores/deck.js'

const route = useRoute()
const router = useRouter()
const store = useDeckStore()
onMounted(async () => { await store.loadDecks() })

const deck = computed(() => store.getDeckById(route.params.deckId))

const totalCards = computed(() => deck.value?.cards.length ?? 0)
const knownCards = computed(() => deck.value?.cards.filter((c) => c.isKnown).length ?? 0)
const unknownCards = computed(() => totalCards.value - knownCards.value)

const mastery = computed(() => {
  if (totalCards.value === 0) return 0
  return Math.round((knownCards.value / totalCards.value) * 100)
})

const motivationalIcon = computed(() => {
  if (mastery.value >= 90) return '🏆'
  if (mastery.value >= 70) return '🎉'
  if (mastery.value >= 50) return '💪'
  return ''
})

const masteryColorClass = computed(() => {
  if (mastery.value >= 70) return 'text-success'
  if (mastery.value >= 50) return 'text-warning'
  return 'text-danger'
})

const masteryBarClass = computed(() => {
  if (mastery.value >= 70) return 'bg-success'
  if (mastery.value >= 50) return 'bg-warning'
  return 'bg-danger'
})

async function studyAgain() {
  if (deck.value) {
    await store.resetProgress(deck.value.id)
    router.push(`/user/study/${deck.value.id}`)
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div v-if="!deck">
        <div class="alert alert-warning">Deck not found.</div>
      </div>

      <div v-else class="text-center">
        <div class="fs-1 mb-2">{{ motivationalIcon }}</div>
        <h2 class="mb-1">Session Complete!</h2>
        <h5 class="text-muted mb-4">{{ deck.title }}</h5>

        <!-- Score card -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body py-4">
            <div class="row g-3 mb-4">
              <div class="col-4">
                <div class="fs-3 text-primary">{{ totalCards }}</div>
                <div class="text-muted small">Total Cards</div>
              </div>
              <div class="col-4">
                <div class="fs-3 text-success">{{ knownCards }}</div>
                <div class="text-muted small">Got It</div>
              </div>
              <div class="col-4">
                <div class="fs-3 text-danger">{{ unknownCards }}</div>
                <div class="text-muted small">Still Learning</div>
              </div>
            </div>

            <div class="mb-2">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">Mastery</span>
                <span class="small" :class="masteryColorClass">{{ mastery }}%</span>
              </div>
              <div class="progress" role="progressbar">
                <div class="progress-bar progress-bar-striped" :class="masteryBarClass"
                  :style="{ width: mastery + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex flex-column gap-2">
          <button class="btn btn-primary" @click="studyAgain">Study Again</button>
          <router-link to="/user" class="btn btn-outline-secondary">← Back to Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
