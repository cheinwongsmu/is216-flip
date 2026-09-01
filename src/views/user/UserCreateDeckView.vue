<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../../stores/deck.js'
import CardEditor from '../../components/CardEditor.vue'

const router = useRouter()
const store = useDeckStore()

const subjects = ['HTML', 'CSS', 'JavaScript', 'Vue', 'General']
const step = ref(1)
const titleError = ref('')

const form = ref({ title: '', subject: 'JavaScript', description: '' })
const cards = ref([{ front: '', back: '' }])

function nextStep() {
  titleError.value = ''
  if (!form.value.title.trim()) {
    titleError.value = 'Please enter a deck title.'
    return
  }
  step.value = 2
}

function addCard() {
  cards.value.push({ front: '', back: '' })
}

function removeCard(index) {
  cards.value.splice(index, 1)
}

function updateCard(index, updated) {
  cards.value[index] = updated
}

async function saveDeck() {
  const deckId = await store.createDeck(form.value)
  await store.addCards(deckId, cards.value.map((c) => ({ front: c.front.trim(), back: c.back.trim() })))
  router.push('/user')
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="d-flex align-items-center gap-2 mb-4">
        <router-link to="/user" class="btn btn-sm btn-outline-secondary">← Back</router-link>
        <h2 class="h4 mb-0">Create New Deck</h2>
      </div>

      <!-- Step 1: Deck info -->
      <div v-if="step === 1">
        <div class="card border-0 mb-4">
          <div class="card-body">
            <h5 class="mb-3">Deck Details</h5>
            <div class="mb-3">
              <label class="form-label">Deck Title <span class="text-danger">*</span></label>
              <input v-model="form.title" type="text" class="form-control" placeholder="e.g. JavaScript ES6 Features" />
            </div>
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select v-model="form.subject" class="form-select">
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Description <span class="text-secondary small">(optional)</span></label>
              <textarea v-model="form.description" class="form-control" rows="2"
                placeholder="A brief description of this deck"></textarea>
            </div>
            <div v-if="titleError" class="text-danger small mb-2">{{ titleError }}</div>
            <button class="btn btn-primary w-100" @click="nextStep">
              Next: Add Cards →
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Card editor -->
      <div v-else>
        <div class="alert alert-info d-flex justify-content-between align-items-center mb-4">
          <div>
            <strong>{{ form.title }}</strong>
            <span class="ms-2 badge bg-primary">{{ form.subject }}</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary" @click="step = 1">Edit Details</button>
        </div>

        <h5 class="mb-3">Add Cards</h5>

        <CardEditor v-for="(card, i) in cards" :key="i" :card="card" :index="i"
          @update="(updatedCard) => updateCard(i, updatedCard)" @delete="removeCard(i)" />

        <button class="btn btn-outline-primary w-100 mb-4" @click="addCard">
          + Add Another Card
        </button>

        <div class="d-flex gap-2">
          <router-link to="/user" class="btn btn-outline-secondary">Cancel</router-link>
          <button class="btn btn-success flex-fill" @click="saveDeck">
            Save Deck ({{ cards.length }} card{{ cards.length !== 1 ? 's' : '' }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
