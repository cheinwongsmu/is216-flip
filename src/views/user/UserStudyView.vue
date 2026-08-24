<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeckStore } from '../../stores/deck.js'
import { useStudySession } from '../../composables/useStudySession.js'
import FlashCard from '../../components/FlashCard.vue'

const route = useRoute()
const router = useRouter()
const store = useDeckStore()

const deck = computed(() => store.getDeckById(route.params.deckId))

const studyCards = computed(() => {
  if (!deck.value) return []
  return deck.value.cards
})

const session = useStudySession(studyCards.value)
const hasFlippedOnce = ref(false)

onMounted(async () => {
  await store.loadDecks()
})

watch(
  studyCards,
  (newCards) => {
    session.restartWithCards(newCards)
  },
  { immediate: true }
)

watch(
  () => session.isFlipped.value,
  (flipped) => {
    if (flipped) hasFlippedOnce.value = true
  }
)

let redirectTimer = null

watch(
  () => session.isSessionComplete.value,
  (done) => {
    if (done) {
      redirectTimer = setTimeout(() => {
        router.push(`/user/results/${deck.value.id}`)
      }, 2000)
    }
  }
)

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer)
})

function handleKnown() {
  if (deck.value && session.currentCard.value) {
    store.markKnown(deck.value.id, session.currentCard.value.id)
  }
  session.markKnown()
}

function handleUnknown() {
  if (deck.value && session.currentCard.value) {
    store.markUnknown(deck.value.id, session.currentCard.value.id)
  }
  session.markUnknown()
}

function shuffleSession() {
  hasFlippedOnce.value = false
  session.shuffle()
}

function resetAndRestart() {
  hasFlippedOnce.value = false
  session.restartWithCards(studyCards.value)
}
</script>

<template>
  <div>
    <div v-if="!deck">
      <div class="alert alert-warning">Deck not found.</div>
    </div>

    <div v-else-if="studyCards.length === 0">
      <div class="alert alert-info">
        This deck has no cards yet.
        <router-link :to="`/user/edit/${deck.id}`" class="btn btn-sm btn-primary ms-3">Add Cards</router-link>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex flex-column flex-md-row mb-3 gap-2 justify-content-between align-items-start">
        <div>
          <router-link to="/user" class="btn btn-sm btn-outline-secondary me-2">← Dashboard</router-link>
          <span class="fs-5">{{ deck.title }}</span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" @click="shuffleSession" title="Shuffle cards">
            Shuffle
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="resetAndRestart" title="Restart session">
            Restart
          </button>
        </div>
      </div>

      <!-- Session complete -->
      <div v-if="session.isSessionComplete.value" class="text-center py-4">
        <div class="fs-1 mb-2">✅</div>
        <h4>Session complete!</h4>
        <p class="text-muted">Redirecting to results…</p>
      </div>

      <!-- Card study area -->
      <div v-else class="d-flex flex-column align-items-center">
        <FlashCard :front="session.currentCard.value.front" :back="session.currentCard.value.back"
          :is-flipped="session.isFlipped.value" @flip="session.flip()" />

        <!-- Flip hint -->
        <p v-if="!session.isFlipped.value && !hasFlippedOnce" class="text-muted small mt-3 mb-0">
          Click card to reveal answer
        </p>

        <!-- Got it / Still learning buttons (shown after flip) -->
        <div v-if="session.isFlipped.value" class="d-flex gap-3 mt-4">
          <button class="btn btn-danger" style="min-width: 150px;" @click="handleUnknown">
            ❌ Still learning
          </button>
          <button class="btn btn-success" style="min-width: 150px;" @click="handleKnown">
            ✅ Got it
          </button>
        </div>

        <!-- Navigation controls (shown when not flipped) -->
        <div v-else class="d-flex align-items-center gap-3 mt-4">
          <button class="btn btn-outline-secondary" :disabled="session.currentIndex.value === 0"
            @click="session.previous()">
            ← Prev
          </button>
          <span class="text-muted small">{{ session.currentIndex.value + 1 }} / {{ studyCards.length }}</span>
          <button class="btn btn-outline-secondary" :disabled="session.currentIndex.value === studyCards.length - 1"
            @click="session.next()">
            Next →
          </button>
        </div>
      </div>

      <!-- Session stats -->
      <div class="d-flex justify-content-center text-center gap-4 mt-5">
        <div>
          <div class="text-success fs-4">{{ session.knownCount.value }}</div>
          <div class="text-muted small">Got it</div>
        </div>
        <div>
          <div class="text-danger fs-4">{{ session.unknownCount.value }}</div>
          <div class="text-muted small">Still learning</div>
        </div>
      </div>
    </div>
  </div>
</template>