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
import {getToken} from '@/service/AccessToken'
import VueTheMask from 'vue-the-mask'


// Types
import type { App } from "vue";

export async function registerPlugins(app: App, env: string) {


  // initializing puglins
  app.use(VueTheMask)
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
    apiUrl = 'http://localhost:81/prod/system/';
  } else {
    if (env === 'prod') {
      apiUrl = 'https://api.drunagor.app/prod/system/';
    } else {
      if (env === 'test') {
        apiUrl = 'https://api.drunagor.app/test/system/';
      }
      else{
        console.log("deu ruim")
      }
    }
  }

  const assets = "https://assets.drunagor.app"

  const globalAxios = app.config.globalProperties.axios

  globalAxios.defaults.baseURL = apiUrl

  app.provide('axios', globalAxios)
  app.provide('assets', assets)
  app.provide('apiUrl', apiUrl)

  await loadLanguage("en_US");

  const configurationStore = ConfigurationStore();

  await loadLanguage(configurationStore.enabledLanguage);
}