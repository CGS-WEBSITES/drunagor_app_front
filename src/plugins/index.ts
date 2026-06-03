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
import { useRagStore } from "../store/ragStore";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import "primevue/resources/themes/lara-dark-green/theme.css";
import "primeicons/primeicons.css";
import axios from 'axios'
import VueAxios from 'vue-axios'
import { getToken } from '@/service/AccessToken'
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

  let apiUrl: string = "";

  if (env === 'local') {
    apiUrl = 'http://localhost:5009/';
  } else {
    if (env === 'prod') {
      apiUrl = 'https://api.drunagor.app/prod/system/';
    } else {
      if (env === 'test') {
        apiUrl = 'https://api.drunagor.app/test/system/';
      }
      else {
        console.log("deu ruim")
      }
    }
  }

  const assets = "https://assets.drunagor.app"

  let ragApiUrl: string = "";

  if (env === 'local') {
    ragApiUrl = 'http://localhost:5001/api';
  } else if (env === 'test') {
    ragApiUrl = 'https://ai.drunagor.app/api';
  } else if (env === 'prod') {
    ragApiUrl = 'https://ai.drunagor.app/api';
  }

  const globalAxios = app.config.globalProperties.axios

  globalAxios.defaults.baseURL = apiUrl

  // Automatically inject accessToken from localStorage to all outbound requests to prevent 401s due to lifecycle/initialization race conditions
  globalAxios.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Centralized client-side fallback to compute party_role since backend removed it
  globalAxios.interceptors.response.use(async (response: any) => {
    const url = response.config.url || "";
    if (url.includes("rl_campaigns_users/search") && response.data?.campaigns?.length > 0) {
      const urlHasCampaignsFk = url.includes("campaigns_fk=");
      const paramsHasCampaignsFk = response.config.params && response.config.params.campaigns_fk;
      
      if (urlHasCampaignsFk || paramsHasCampaignsFk) {
        const campaigns = response.data.campaigns;
        for (const campaignRelation of campaigns) {
          if (!campaignRelation.party_role) {
            try {
              const campaignId = campaignRelation.campaigns_fk;
              if (campaignId) {
                const playersRes = await globalAxios.get("/rl_campaigns_users/list_players", {
                  params: { campaigns_fk: campaignId }
                });
                const players = playersRes.data?.Users || [];
                if (players.length > 0) {
                  const sortedPlayers = [...players].sort((a: any, b: any) => a.rl_campaigns_users_pk - b.rl_campaigns_users_pk);
                  const leader = sortedPlayers[0];
                  
                  const { useUserStore } = await import("@/store/UserStore");
                  const userStore = useUserStore();
                  
                  if (userStore.user && leader.user_name === userStore.user.user_name) {
                    campaignRelation.party_role = "Admin";
                  } else {
                    campaignRelation.party_role = "Player";
                  }
                }
              }
            } catch (e) {
              console.error("Error computing party_role in Axios interceptor:", e);
            }
          }
        }
      }
    }
    return response;
  });

  app.provide('axios', globalAxios)
  app.provide('assets', assets)
  app.provide('apiUrl', apiUrl)
  app.provide('ragApiUrl', ragApiUrl)

  const ragStore = useRagStore()
  ragStore.setBaseUrl(ragApiUrl)

  await loadLanguage("en_US");

  const configurationStore = ConfigurationStore();

  await loadLanguage(configurationStore.enabledLanguage);
}