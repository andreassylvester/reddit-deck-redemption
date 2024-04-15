import MainView from '@/views/Main.vue'
import FourOhFour from '@/views/FourOhFour.vue'

export default [
  { path: "/", component: MainView },
  { path: "/redirect", component: MainView },
  { path: '/:pathMatch(.*)', component: FourOhFour }
]