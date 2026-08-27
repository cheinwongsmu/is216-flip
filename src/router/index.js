import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

import UserViewsLayout from '../layouts/UserViewsLayout.vue'
import AdminViewsLayout from '../layouts/AdminViewsLayout.vue'

import UserDashboardView from '../views/user/UserDashboardView.vue'
import UserProfileView from '../views/user/UserProfileView.vue'
import UserCreateDeckView from '../views/user/UserCreateDeckView.vue'
import UserEditDeckView from '../views/user/UserEditDeckView.vue'
import UserStudyView from '../views/user/UserStudyView.vue'
import UserResultsView from '../views/user/UserResultsView.vue'

import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminDecksView from '../views/admin/AdminDecksView.vue'

const routes = [
  // Root redirect
  { path: '/', redirect: '/landing' },

  // Public routes
  { path: '/landing', component: LandingView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },

  // User routes (UserViewsLayout as parent)
  {
    path: '/user',
    component: UserViewsLayout,
    children: [
      { path: '', component: UserDashboardView },
      { path: 'profile', component: UserProfileView },
      { path: 'create', component: UserCreateDeckView },
      { path: 'edit/:deckId', component: UserEditDeckView },
      { path: 'study/:deckId', component: UserStudyView },
      { path: 'results/:deckId', component: UserResultsView },

    ],
  },

  // Admin routes (AdminViewsLayout as parent)
  {
    path: '/admin',
    component: AdminViewsLayout,
    children: [
      { path: '', component: AdminDashboardView },
      { path: 'decks', component: AdminDecksView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// router.beforeEach is a navigation guard — it runs before every route
// change in the app, letting you intercept and redirect the user before
// the View loads. If none of the checks trigger, the guard returns
// nothing, which means allow the navigation to proceed.
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  await auth.init()

  if (to.path == '/user') {
    if (auth.profile.role == 'admin') router.push('/admin')
  }

  // Perform access control checks on protected and public views,
  // and redirect as needed.

})

export default router
