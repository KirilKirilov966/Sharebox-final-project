import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'animate.css'

// Import and use vue3-particles
import Particles from 'vue3-particles'

const app = createApp(App)

app.use(router)
app.use(Particles) 

app.mount('#app')
