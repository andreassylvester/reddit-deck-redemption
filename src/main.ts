import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import mdiVue from 'mdi-vue/v3'
import * as icons from '@mdi/js'

import './style.css'
import App from './App.vue'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(router)
  .use(mdiVue, { icons })
  .mount('#app')
