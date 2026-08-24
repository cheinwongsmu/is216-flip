<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ identifier: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''

  const result = await auth.login(form.value)

  if (!result.ok) {
    error.value = result.error
  } else {
    router.push('/user')
  }
}
</script>

<template>
  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card card shadow-lg border-0">
      <div class="card-body p-4 p-md-5">
        <!-- Logo -->
        <div class="text-center mb-4">
          <router-link to="/landing" class="brand text-decoration-none d-inline-flex align-items-center gap-2">
            <img src="/logo.gif" alt="FLIP logo" class="brand-logo" />
            <span class="fw-bold fs-4">FLIP</span>
          </router-link>
          <h2 class="h4 mt-3 mb-1">Welcome back!</h2>
          <p class="text-muted">Sign in to continue studying.</p>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <!-- Form -->
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.identifier" type="email" class="form-control" placeholder="you@example.com" required />
          </div>
          <div class="mb-4">
            <label class="form-label">Password</label>
            <div>
              <input v-model="form.password" type="password" class="form-control" placeholder="Enter your password"
                required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100 py-2">Sign In</button>
        </form>

        <hr class="my-4" />

        <p class="text-center text-muted mb-0">
          Don't have an account?
          <router-link to="/register">Create one free</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100vh;
  background: #f1f5f9;
  padding: 2rem 1rem;
}

.auth-card {
  width: 440px;
  border-radius: 20px;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563EB;
}

.brand-logo {
  width: 40px;
  height: 40px;
}
</style>
