<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeckStore } from '../../stores/deck.js'
import CardEditor from '../../components/CardEditor.vue'

const route = useRoute()
const router = useRouter()
const store = useDeckStore()

const deck = computed(() => store.getDeckById(route.params.deckId))

const saveError = ref('')
const saving = ref(false)
const form = ref({ title: '', subject: 'JavaScript', description: '' })
const subjects = ['HTML', 'CSS', 'JavaScript', 'Vue', 'General']

const localCards = ref([])

onMounted(async () => {
  await store.loadDecks()
  if (deck.value) {
    form.value = { title: deck.value.title, subject: deck.value.subject, description: deck.value.description || '' }
    localCards.value = deck.value.cards.map((c) => ({ ...c }))
  }

})

function addCard() {
  localCards.value.push({ front: '', back: '', isKnown: false })
}

function updateCard(index, updated) {
  localCards.value[index] = updated
}

function removeCard(index) {
  localCards.value.splice(index, 1)
}

async function save() {
  saveError.value = ''
  if (!form.value.title.trim()) {
    saveError.value = 'Please enter a deck title.'
    return
  }
  saving.value = true
  await store.updateDeck(deck.value.id, {
    title: form.value.title.trim(),
    subject: form.value.subject,
    description: form.value.description.trim(),
    cards: localCards.value.map((c) => ({
      id: c.id,
      front: c.front.trim(),
      back: c.back.trim(),
      isKnown: c.isKnown,
    })),
  })
  saving.value = false
  router.push('/user')
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="d-flex align-items-center gap-2 mb-4">
        <router-link to="/user" class="btn btn-sm btn-outline-secondary">← Back</router-link>
        <h2 class="h4 mb-0">Edit Deck</h2>
      </div>

      <div v-if="!deck">
        <div class="alert alert-warning">Deck not found.</div>
      </div>

      <div v-else>
        <!-- Deck details -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="mb-3">Deck Details</h5>
            <div class="mb-3">
              <label class="form-label">Deck Title <span class="text-danger">*</span></label>
              <input v-model="form.title" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="form.subject" class="form-select">
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control" rows="2"></textarea>
            </div>
          </div>
        </div>

        <!-- Cards -->
        <h5 class="mb-3">Cards ({{ localCards.length }})</h5>

        <CardEditor v-for="(card, i) in localCards" :key="i" :card="card" :index="i"
          @update="(updatedCard) => updateCard(i, updatedCard)" @delete="removeCard(i)" />

        <button class="btn btn-outline-primary w-100 mb-4" @click="addCard">
          + Add Another Card
        </button>

        <div v-if="saveError" class="text-danger small mb-2">{{ saveError }}</div>

        <div class="d-flex gap-2">
          <router-link to="/user" class="btn btn-outline-secondary">Cancel</router-link>
          <button class="btn btn-success flex-fill" :disabled="saving" @click="save">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ saving ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
