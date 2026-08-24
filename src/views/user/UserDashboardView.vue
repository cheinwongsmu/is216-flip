<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDeckStore } from '../../stores/deck.js'
import EmptyState from '../../components/EmptyState.vue'
import DeckCard from '../../components/DeckCard.vue'


const store = useDeckStore()
onMounted(() => store.loadDecks())
const searchQuery = ref('')
const selectedSubject = ref('')
const deckToDelete = ref(null)

const subjects = ['HTML', 'CSS', 'JavaScript', 'Vue', 'General']

const filteredDecks = computed(() => {
  return store.decks.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesSubject = selectedSubject.value === '' || d.subject === selectedSubject.value
    return matchesSearch && matchesSubject
  })
})

function confirmDelete(deckId) {
  deckToDelete.value = deckId
}

async function doDelete() {
  if (deckToDelete.value) {
    await store.deleteDeck(deckToDelete.value)
    deckToDelete.value = null
  }
}
</script>

<template>
  <div>
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
      <div>
        <h1 class="h3 mb-0" style="color: #2563EB;">My Flashcard Decks</h1>
        <p class="text-muted mb-0 small">Study smarter, one flip at a time.</p>
      </div>
      <router-link to="/user/create" class="btn btn-primary">
        + Create New Deck
      </router-link>
    </div>

    <!-- Search & Filter -->
    <div class="row g-2 mb-3">
      <div class="col-md-9">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Search decks by title..." />
      </div>
      <div class="col-md-3">
        <select v-model="selectedSubject" class="form-select">
          <option value="">All Categories</option>
          <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState v-if="store.totalDecks === 0" message="No decks yet. Create your first one!">
      <router-link to="/user/create" class="btn btn-primary mt-3">
        + Create New Deck
      </router-link>
    </EmptyState>

    <!-- No results from filter -->
    <EmptyState v-else-if="filteredDecks.length === 0" message="No decks match your search." />

    <!-- Deck grid -->
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="deck in filteredDecks" :key="deck.id" class="col">
        <DeckCard :deck="deck" @delete="confirmDelete" />
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="deckToDelete" class="modal show" style="display: block;" @click.self="deckToDelete = null">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Delete Deck?</h1>
            <button type="button" class="btn-close" aria-label="Close" @click="deckToDelete = null"></button>
          </div>
          <div class="modal-body">
            This will permanently delete the deck and all its cards. This cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="deckToDelete = null">Cancel</button>
            <button type="button" class="btn btn-danger" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="deckToDelete" class="modal-backdrop show"></div>
  </div>
</template>