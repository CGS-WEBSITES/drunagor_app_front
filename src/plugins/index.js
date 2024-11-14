/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import { loadLanguage } from "../language";
import { i18n } from "../i18n";
import { ConfigurationStore } from "../store/ConfigurationStore";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "primevue/resources/themes/lara-dark-green/theme.css";
import "primeicons/primeicons.css";
export async function registerPlugins(app) {
    app.use(vuetify);
    app.use(router);
    app.use(pinia);
    app.use(i18n);
    app.use(PrimeVue, { ripple: true });
    app.use(ToastService);
    await loadLanguage("en_US");
    const configurationStore = ConfigurationStore();
    await loadLanguage(configurationStore.enabledLanguage);
}
