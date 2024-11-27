/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Cria uma instância do Vuetify
const vuetify = createVuetify()

const app = createApp(App)

registerPlugins(app)

// Usa o Vuetify na aplicação
app.use(vuetify)

app.mount('#app')
