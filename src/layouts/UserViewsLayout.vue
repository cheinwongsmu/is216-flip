<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useDeckStore } from '../stores/deck.js'

const router = useRouter()
const auth = useAuthStore()
const deckStore = useDeckStore()

const avatarInitial = computed(() => (auth.profile.username?.[0] ?? '?').toUpperCase())

async function logout() {
  await auth.logout()
  deckStore.reset()
  router.push('/landing')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #0f172a;">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/user">
        <img src="/logo.gif" alt="FLIP logo" class="nav-logo" />
        <span>FLIP</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/user" active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/user/create" active-class="active">Create Deck</router-link>
          </li>
        </ul>

        <!-- Username dropdown -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <span class="avatar-circle">{{ avatarInitial }}</span>
              <span class="fw-semibold" data-testid="username">{{ auth.profile.username }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
              <li>
                <div class="dropdown-header d-flex align-items-center gap-2 py-2">
                  <span class="avatar-circle avatar-lg">{{ avatarInitial }}</span>
                  <div>
                    <div>{{ auth.profile.username }}</div>
                    <div class="small text-muted">{{ auth.profile.email }}</div>
                  </div>
                </div>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link class="dropdown-item" to="/user/profile">Profile</router-link>
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
      </div>
    </div>
  </nav>

  <main class="py-4" style="min-height: calc(100vh - 56px); background-color: #f0f4ff;">
    <div class="container">
      <router-view />
    </div>
  </main>
</template>
