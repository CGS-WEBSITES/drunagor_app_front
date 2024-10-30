// Styles

import "./assets/main.css";
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(createVuetify({
    theme: {
      defaultTheme: 'dark',
    },
  }))
app.use(router);

app.mount("#app");
