<template>
  <router-view />
</template>

<style>
body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #0f172a;
}

a {
  color: #2563EB;
}

.nav-logo {
  width: 36px;
  height: 36px;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #5b5b5c;
  color: #fff;
  border: 2px solid #a6a6a8;
}

.avatar-lg {
  background: #2563EB;
  color: #fff;
}

.dropdown-menu {
  border-radius: 12px;
  width: 220px;
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 12px;
  padding: 0.5rem;
}

.dropdown-item:hover {
  background-color: #f0f4ff;
}
</style>
