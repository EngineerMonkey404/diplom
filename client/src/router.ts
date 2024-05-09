import { createMemoryHistory, createRouter } from 'vue-router'
import ModelView from "./pages/ModelView.vue"
import StartPage from "./pages/StartPage.vue"

const routes = [
    { path: '/', component: StartPage },
    { path: '/models/:id',name: 'modelView',  component: ModelView}
  ]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
