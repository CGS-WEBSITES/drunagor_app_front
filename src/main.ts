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
import '@fontsource/cinzel';


const app = createApp(App);

registerPlugins(app,"test");




app.mount("#app");
