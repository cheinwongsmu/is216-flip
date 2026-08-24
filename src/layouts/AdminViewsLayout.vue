<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useDeckStore } from '../stores/deck.js'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const deckStore = useDeckStore()

const pageTitle = computed(() => {
  if (route.path === '/admin') return 'Dashboard'
  if (route.path.startsWith('/admin/decks')) return 'Content Moderation'
  return 'Admin'
})

const avatarInitial = computed(() => (auth.profile.username?.[0] ?? '?').toUpperCase())

async function logout() {
  await auth.logout()
  deckStore.reset()
  router.push('/landing')
}
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside id="adminSidebar" class="admin-sidebar offcanvas-start offcanvas-md" tabindex="-1">
      <div class="sidebar-panel">
        <div class="sidebar-brand">
          <img src="/logo.gif" alt="FLIP" class="sidebar-logo" />
          <span>FLIP Admin</span>
        </div>

        <nav class="sidebar-nav">
          <router-link to="/admin" exact-active-class="active">
            <span>📊</span> Dashboard
          </router-link>
          <router-link to="/admin/decks" active-class="active">
            <span>📚</span> Decks
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <router-link to="/" class="btn-back">← Back to App</router-link>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div class="admin-main">
      <header class="admin-topbar px-3 px-md-4">
        <button class="sidebar-toggle d-flex d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebar" aria-controls="adminSidebar">
          <span></span><span></span><span></span>
        </button>
        <div>{{ pageTitle }}</div>

        <!-- Username dropdown -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="avatar-circle">{{ avatarInitial }}</span>
              <span class="d-none d-sm-inline-block">{{ auth.profile.username }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <div class="dropdown-header d-flex align-items-center gap-2 py-2">
                  <span class="avatar-circle avatar-lg">{{ avatarInitial }}</span>
                  <div>
                    <div class="d-sm-block">{{ auth.profile.username }}</div>
                    <div class="small text-muted">{{ auth.profile?.email }}</div>
                  </div>
                </div>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="logout">
                  🚪 Log Out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </header>
      <div class="p-3 p-md-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  background: #f1f5f9;
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
}

.sidebar-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1.5rem 1.5rem 1rem;
  color: #fff;
  border-bottom: 1px solid #faf5f522;
}

.sidebar-logo {
  width: 30px;
  height: 30px;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav a {
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  color: #faefef88;
  text-decoration: none;
}

.sidebar-nav a:hover {
  background: #f4f5f814;
  color: #fff;
}

.sidebar-nav a.active {
  background: #2563EB;
  color: #fff;
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #d2dcf82d;
}

.btn-back {
  color: #e8ebf3ca;
  text-decoration: none;
}

.btn-back:hover {
  color: #fff;
}

/* ── Sidebar toggle (mobile) ── */
.sidebar-toggle {
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-right: 1rem;
}

.sidebar-toggle span {
  height: 2px;
  background: #9a9da3;
}

/* ── Main ── */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 0;
}

.admin-topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
}

.admin-topbar .avatar-circle {
  background: #2563EB;
  color: #fff;
}
</style>
