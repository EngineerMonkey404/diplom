import { createApp } from 'vue'
import App from './App.vue'
import "./index.css"
import { router } from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'

createApp(App).use(router).use(PrimeVue).mount('#app')
