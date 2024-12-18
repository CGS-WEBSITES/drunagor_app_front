import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/Login.vue";
import Library from "@/pages/Library.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("@/pages/Login.vue"),
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/Dashboard.vue"),
    },
    {
      path: "/Library",
      name: "Library",
      component: Library, // Certifique-se de que o componente está importado corretamente
    },
    {
      path: "/perfil",
      name: "Perfil",
      component: () => import("@/pages/Perfil.vue"),
      children:[
        {
          path: "/perfil/home",
          name: "PerfilHome",
          component: () => import("@/components/PerfilHome.vue"),
        },
        {
          path: "/perfil/friend-store",
          name: "FriendStore",
          component: () => import("@/components/FriendStore.vue"),
        },
        {
          path: "/perfil/friend-storelist",
          name: "FriendStoreList",
          component: () => import("@/components/FriendStoreList.vue"),
        },
        {
          path: "/perfil/perfil-settings",
          name: "PerfilSettings",
          component: () => import("@/components/PerfilSettings.vue"),
        },
        {
          path: "/perfil/perfil-image",
          name: "PerfilImage",
          component: () => import("@/components/PerfilImage.vue"),
        },
      ]
    },
    {
      path: "/tracker-parent",
      name: "TrackerParent",
      component: () => import("@/pages/CampaignTracker.vue"),
      children: [
        {
          path: "/campaign-tracker",
          name: "CampaignTracker",
          component: () => import("@/components/RandomizerView.vue"),
        },
        {
          path: "/campaign-tracker/configuration",
          name: "Configuration",
          component: () => import("@/components/ConfigurationView.vue"),
        },
        { path: "/campaign-tracker/party", redirect: "/campaign" },
        {
          path: "/campaign-tracker/campaign/:id",
          name: "Campaign",
          component: () => import("@/components/CampaignView.vue"),
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId",
          name: "Hero",
          component: () => import("@/components/HeroDetailView.vue"),
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId/sequential-state",
          name: "HeroSequentialState",
          component: () =>
            import("@/components/CampaignHeroSequentialAdventure.vue"),
        },
        {
          path: "/campaign-tracker/campaign",
          name: "Campaign Overview",
          component: () => import("@/components/CampaignOverviewView.vue"),
        },
        {
          path: "/campaign-tracker/keyword",
          name: "Keyword",
          component: () => import("@/components/KeywordView.vue"),
        },
      ],
    },
  ],
});
export default router;
