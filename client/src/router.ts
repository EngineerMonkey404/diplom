import { createWebHistory, createRouter } from 'vue-router'
import ModelView from "./pages/ModelView.vue"
import StartPage from "./pages/StartPage.vue"

const routes = [
    { path: '/', component: StartPage },
    { path: '/models/:filename',name: 'modelView',  component: ModelView}
  ]

export const router = createRouter({
    history: createWebHistory(),
    routes,
  })
