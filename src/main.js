import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadFull } from 'tsparticles'

import App from './App.vue'
import router from './router/index.js'
import Particles from '@tsparticles/vue3'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine)
  },
})
app.mount('#app')
