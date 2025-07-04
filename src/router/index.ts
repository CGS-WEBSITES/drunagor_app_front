import { createRouter, createWebHistory } from "vue-router";
import { isSignedIn } from "@/service/AccessToken";

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
      path: "/retailer-registration",
      name: "RetailerRegistration",
      component: () => import("@/pages/RetailerRegistration.vue"),
    },
    {
      path: "/forgotpassword",
      name: "ForgotPassword",
      component: () => import("@/components/ForgotPassword.vue"),
    },
    {
      path: "/gama",
      name: "Gama",
      component: () => import("@/pages/Gama.vue"),
    },
    {
      path: "/community",
      name: "Community",
      component: () => import("@/pages/Community.vue"),
    },
    {
      path: "/events",
      name: "Events",
      component: () => import("@/pages/Events.vue"),
    },
    {
      path: "/user/:id",
      name: "User",
      component: () => import("@/pages/User.vue"),
    },
    {
      path: "/event/:id",
      name: "ShareEvent",
      component: () => import("@/pages/ShareEvent.vue"),
    },
    {
      path: "/library",
      name: "Library",
      component: () => import("@/pages/Library.vue"),

      beforeEnter(to, from, next) {
        if (isSignedIn()) {
          next()
          return
        }
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/Dashboard.vue"),
      beforeEnter(to, from, next) {
        if (isSignedIn()) {
          next()
          return
        }
      },
    },
    {
      path: "/tracker-parent",
      name: "TrackerParent",
      component: () => import("@/pages/CampaignTracker.vue"),
      beforeEnter(to, from, next) {
        if (isSignedIn()) {
          next()
          return
        }
      },
      children: [
        {
          path: "/campaign-tracker/",
          name: "Campaign Overview",
          component: () => import("@/components/CampaignOverviewView.vue"),
          /* beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          }, */
        },
        {
          path: "/campaign-tracker/randomizer",
          name: "Randomizer",
          component: () => import("@/components/RandomizerView.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/campaign-tracker/configuration",
          name: "Configuration",
          component: () => import("@/components/ConfigurationView.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        { path: "/campaign-tracker/party", redirect: "/campaign-tracker/campaign" },
        {
          path: "/campaign-tracker/campaign/:id",
          name: "Campaign",
          component: () => import("@/components/CampaignView.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId",
          name: "Hero",
          component: () => import("@/components/HeroDetailView.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId/sequential-state",
          name: "HeroSequentialState",
          component: () =>
            import("@/components/CampaignHeroSequentialAdventure.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/campaign-tracker/keyword",
          name: "Keyword",
          component: () => import("@/components/KeywordView.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        }
      ],
    },
    {
      path: "/profile",
      name: "Perfil",
      component: () => import("@/pages/Perfil.vue"),
      beforeEnter(to, from, next) {
        if (isSignedIn()) {
          next()
          return
        }
      },
      children: [
        {
          path: "/profile/home",
          name: "PerfilHome",
          component: () => import("@/components/PerfilHome.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/profile/friend-store",
          name: "search",
          component: () => import("@/components/FriendStore.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/profile/friend-storelist",
          name: "group",
          component: () => import("@/components/FriendStoreList.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/profile/settings",
          name: "settings",
          component: () => import("@/components/PerfilSettings.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
        {
          path: "/profile/store-settings",
          name: "logout",
          component: () =>
            import("@/components/StoreSettings.vue"),
          beforeEnter(to, from, next) {
            if (isSignedIn()) {
              next()
              return
            }
          },
        },
      ]
    }

  ],
});

export default router;

