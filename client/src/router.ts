import { createWebHistory, createRouter } from 'vue-router'
import ModelView from './pages/ModelView.vue'
import StartPage from './pages/StartPage.vue'
import AdminPage from './pages/admin/AdminPage.vue'
import CreateModelPage from './pages/admin/CreateModelPage.vue'
import LoginPage from './pages/admin/LoginPage.vue'
import { useCookies } from 'vue3-cookies'

const routes = [
  { path: '/', component: StartPage },
  { path: '/models/:id', name: 'modelView', component: ModelView },
  { path: '/admin', component: AdminPage },
  { path: '/admin/create-model', component: CreateModelPage },
  { path: '/admin/login', component: LoginPage },
]

const { cookies } = useCookies()

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.path !== '/admin/login' && to.path.includes('admin')) {
    if (cookies.get('role') !== 'admin') {
      return '/admin/login'
    }
  }
})
