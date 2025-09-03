/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Fonts and Styles
import '@fontsource/cinzel';
import '@/assets/main.css';  
import '@/assets/css/fonts.css';


const app = createApp(App);

registerPlugins(app,"test");

app.mount("#app");
