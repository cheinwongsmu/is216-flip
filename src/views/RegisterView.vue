<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ username: '', email: '', password: '', confirm: '' })
const error = ref('')

async function submit() {
  error.value = ''

  if (form.value.password !== form.value.confirm) {
    error.value = 'Passwords do not match.'
    return
  }

  const result = await auth.register({
    uname: form.value.username.trim(),
    email: form.value.email.trim(),
    password: form.value.password,
  })

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
          <h2 class="h4 mt-3 mb-1">Create your account</h2>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <!-- Form -->
        <form @submit.prevent="submit" novalidate>
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input v-model="form.username" type="text" class="form-control" placeholder="Choose a username"
              autocomplete="username" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com"
              autocomplete="email" />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input v-model="form.password" type="password" class="form-control" placeholder="At least 6 characters" />
          </div>

          <div class="mb-4">
            <label class="form-label">Confirm Password</label>
            <input v-model="form.confirm" type="password" class="form-control" placeholder="Re-enter your password" />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">Create Account</button>
        </form>

        <hr class="my-4" />

        <p class="text-center text-muted mb-0">
          Already have an account?
          <router-link to="/login">Sign in</router-link>
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
