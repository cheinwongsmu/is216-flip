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
  <div class="auth-page container-fluid d-flex align-items-center justify-content-center">
    <div class="auth-card card shadow border-0">
      <div class="card-body p-4">
        <!-- Logo -->
        <div class="text-center">
          <router-link to="/landing" class="brand text-decoration-none d-inline-flex align-items-center">
            <img src="/logo.gif" alt="FLIP logo" class="brand-logo" />
            <span>FLIP</span>
          </router-link>
          <h2 class="h4">Create your account</h2>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <!-- Form -->
        <form @submit.prevent="submit" novalidate>
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input v-model="form.username" type="text" class="form-control" placeholder="Choose a username" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="you@example.com" />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input v-model="form.password" type="password" class="form-control" placeholder="At least 6 characters" />
          </div>

          <div class="mb-3">
            <label class="form-label">Confirm Password</label>
            <input v-model="form.confirm" type="password" class="form-control" placeholder="Re-enter your password" />
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2">Create Account</button>
        </form>

        <hr />

        <p class="text-center text-secondary small">
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
  padding: 2rem 1rem;
}

.auth-card {
  width: 400px;
  border-radius: 20px;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-logo {
  width: 50px;
  height: 50px;
}
</style>
