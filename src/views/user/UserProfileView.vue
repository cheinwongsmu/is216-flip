<script setup>
import { useAuthStore } from '../../stores/auth.js'

const auth = useAuthStore()
</script>

<template>
  <div>
    <h1 class="h3 mb-4 text-primary">My Profile</h1>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-4 text-muted">Username</dt>
          <dd class="col-8">{{ auth.profile.username }}</dd>

          <dt class="col-4 text-muted">Email</dt>
          <dd class="col-8">{{ auth.profile.email }}</dd>

          <dt class="col-4 text-muted">Role</dt>
          <dd class="col-8">{{ auth.profile.role }}</dd>

          <dt class="col-4 text-muted">User UUID</dt>
          <dd class="col-8 text-break"><code>{{ auth.profile.user_uuid }}</code></dd>
        </dl>
      </div>
    </div>
  </div>
</template>
