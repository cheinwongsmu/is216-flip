<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../lib/supabase.js'

const loading = ref(true)
const totalUsers = ref(0)
const totalDecks = ref(0)
const totalCards = ref(0)
const subjectData = ref([])

const stats = computed(() => [
  { label: 'Total Users', value: totalUsers.value, icon: '👥', bg: '#EFF6FF' },
  { label: 'Total Decks', value: totalDecks.value, icon: '📚', bg: '#F0FDF4' },
  { label: 'Total Cards', value: totalCards.value, icon: '📇', bg: '#FFF7ED' },
])

async function loadStats() {
  loading.value = true

  const [
    { count: uCount },
    { count: dCount },
    { count: cCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('decks').select('*', { count: 'exact', head: true }),
    supabase.from('cards').select('*', { count: 'exact', head: true }),
  ])
  totalUsers.value = uCount ?? 0
  totalDecks.value = dCount ?? 0
  totalCards.value = cCount ?? 0

  // Subject distribution
  const { data: allDecks } = await supabase.from('decks').select('subject')
  if (allDecks) {
    const counts = {}
    allDecks.forEach((d) => { counts[d.subject] = (counts[d.subject] || 0) + 1 })
    const max = Math.max(...Object.values(counts), 1)
    subjectData.value = Object.entries(counts)
      .map(([subject, count]) => ({ subject, count, pct: Math.round((count / max) * 100) }))
      .sort((a, b) => b.count - a.count)
  }

  loading.value = false
}

onMounted(loadStats)
</script>

<template>
  <div>
    <!-- Stat cards -->
    <div class="row g-3 mb-4">
      <div v-for="s in stats" :key="s.label" class="col-12 col-md-4">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: s.bg }">{{ s.icon }}</div>
          <div>
            <div class="stat-value">{{ loading ? '…' : s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <!-- Subject distribution -->
      <div class="col-12">
        <div class="panel">
          <div>Decks by Subject</div>
          <div v-if="subjectData.length === 0" class="text-muted mt-3">No decks yet.</div>
          <div v-else class="subject-list mt-3">
            <div v-for="s in subjectData" :key="s.subject" class="subject-row">
              <div class="small">{{ s.subject }}</div>
              <div class="bar-wrap">
                <div class="bar-fill" :style="{ width: s.pct + '%' }"></div>
              </div>
              <div class="subject-count small">{{ s.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 4px #05050518;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 500;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
}

.panel {
  background: #fff;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 1px 4px #05050518;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subject-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-wrap {
  flex: 1;
  background: #f1f5f9;
  border-radius: 5px;
  height: 5px;
}

.bar-fill {
  height: 100%;
  background: #2563EB;
  border-radius: 5px;
}

.subject-count {
  width: 20px;
  text-align: right;
}
</style>
