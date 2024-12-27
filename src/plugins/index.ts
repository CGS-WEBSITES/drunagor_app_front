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
import axios from 'axios'
import VueAxios from 'vue-axios'

// Types
import type { App } from "vue";

export async function registerPlugins(app: App, env: string) {


  // initializing puglins
  app.use(vuetify);
  app.use(router);
  app.use(pinia);
  app.use(i18n);
  app.use(PrimeVue, { ripple: true });
  app.use(ToastService);
  app.use(VueAxios, axios)

  // Setting global properties

  let apiUrl: string;

  if (env === 'local') {
    apiUrl = 'http://localhost:5002/';
  } else {
    if (env === 'prod') {
      apiUrl = '';
    } else {
      if (env === 'test') {
        apiUrl = 'http://ec2-18-189-52-115.us-east-2.compute.amazonaws.com:5002/';
      }
      else{
        console.log("ddeu ruim")
      }
    }
  }

  const assets = "http://druna-assets.s3-website.us-east-2.amazonaws.com"

  app.provide('axios', app.config.globalProperties.axios)
  app.provide('assets', assets)
  app.provide('apiUrl', apiUrl)

  await loadLanguage("en_US");

  const configurationStore = ConfigurationStore();

  await loadLanguage(configurationStore.enabledLanguage);
}
