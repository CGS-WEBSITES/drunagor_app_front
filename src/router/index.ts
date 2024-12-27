import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/pages/LandingPage.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/Login.vue"),
    },
    {
      path: "/library",
      name: "Library",
      component: () => import("@/pages/Library.vue"),
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/Dashboard.vue"),
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
        { path: "/campaign-tracker/party", redirect: "/campaign-tracker/campaign" },
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
