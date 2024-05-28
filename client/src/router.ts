import { createWebHistory, createRouter } from 'vue-router'
import ModelView from "./pages/ModelView.vue"
import StartPage from "./pages/StartPage.vue"
import AdminPage from "./pages/admin/AdminPage.vue"
import CreateModelPage from "./pages/admin/CreateModelPage.vue"

const routes = [
    { path: '/', component: StartPage },
    { path: '/models/:filename',name: 'modelView',  component: ModelView},
    { path: '/admin', component: AdminPage, },
    { path: '/admin/create-model', component: CreateModelPage, },
  ]

export const router = createRouter({
    history: createWebHistory(),
    routes,
  })
