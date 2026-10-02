/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { resolveApiEnv } from "@/dev/apiEnv";

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

// Builds use prod unless built with VITE_API_ENV=test (the teste.drunagor.app deploy).
// A local dev server uses the test API by default (see apiEnv).
registerPlugins(app, resolveApiEnv(import.meta.env.VITE_API_ENV || "prod"));

app.mount("#app");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
