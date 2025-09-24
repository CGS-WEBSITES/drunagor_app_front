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
import "@fontsource/cinzel";
import "@/assets/main.css";
import "@/assets/css/fonts.css";

// Shepherd (CSS base + tema custom)
import "shepherd.js/dist/css/shepherd.css";
import "@/components/Composable/shepherd-theme.css";

const app = createApp(App);

registerPlugins(app, "test");

app.mount("#app");
