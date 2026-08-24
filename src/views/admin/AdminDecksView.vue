<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'

const decks = ref([])
const loading = ref(true)
const expandedId = ref(null)

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadDecks() {
  loading.value = true
  const { data } = await supabase
    .from('decks')
    .select('*, profiles(username, email), cards(id, front, back)')
    .order('created_at', { ascending: false })

  decks.value = (data ?? []).map((d) => ({
    ...d,
    owner_username: d.profiles.username ?? '—',
    owner_email: d.profiles.email ?? '',
    card_count: d.cards.length,
  }))
  loading.value = false
}

function toggleExpand(deck) {
  expandedId.value = expandedId.value === deck.id ? null : deck.id
}

onMounted(loadDecks)
</script>

<template>
  <div>
    <div class="table-panel">
      <div v-if="loading" class="text-center py-5 text-muted">Loading decks…</div>
      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Subject</th>
            <th>Cards</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="d in decks" :key="d.id">
            <tr>
              <td>{{ d.title }}</td>
              <td>
                <div class="text-dark">{{ d.owner_username }}</div>
                <div class="text-muted small">{{ d.owner_email }}</div>
              </td>
              <td><span class="subj-chip">{{ d.subject }}</span></td>
              <td class="text-muted">{{ d.card_count }}</td>
              <td class="text-muted" style="font-size:0.82rem;">{{ fmtDate(d.created_at) }}</td>
              <td>
                <div class="d-flex gap-1">
                  <button class="btn btn-xs btn-outline-secondary" @click="toggleExpand(d)">
                    {{ expandedId === d.id ? 'Hide' : 'View Cards' }}
                  </button>
                </div>
              </td>
            </tr>
            <!-- Cards expand row -->
            <tr v-if="expandedId === d.id" class="expand-row">
              <td colspan="6">
                <div class="cards-preview">
                  <div v-if="!d.cards || d.cards.length === 0" class="text-muted small">No cards in this deck.</div>
                  <div v-else class="cards-grid">
                    <div v-for="c in d.cards" :key="c.id" class="card-chip">
                      <div class="card-front">{{ c.front }}</div>
                      <div class="card-back">{{ c.back }}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>



<style scoped>
.table-panel {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px #05050518;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
}

.admin-table th {
  padding: 1rem 1rem;
  text-align: left;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #94a3b8;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table td {
  padding: 1rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.subj-chip {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 20px;
  background: #EFF6FF;
  color: #2563EB;
}

.btn-xs {
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Cards preview */
.cards-preview { 
  padding: 1.2rem 1.2rem; 
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-chip {
  flex: 1 1 calc((100% - 16px) / 3);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  padding: 0.6rem 0.6rem;
}

.card-front { 
  font-weight: 500; 
  color: #0f172a; 
  margin-bottom: 5px; 
}
.card-back  { 
  color: #64748b; 
}

</style>
