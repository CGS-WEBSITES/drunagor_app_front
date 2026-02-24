import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import { isSignedIn } from "@/service/AccessToken";

function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (isSignedIn()) {
    next();
  } else {
    next({ path: "/" });
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/landing-page",
      name: "Home",
      component: () => import("@/pages/LandingPage.vue"),
    },
    {
      path: "/",
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
      beforeEnter: requireAuth,
    },

    {
      path: "/FAQforRetailers",
      name: "FAQ",
      component: () => import("@/components/FAQ.vue"),
    },

    {
      path: "/shared-keywords",
      name: "SharedKeywords",
      component: () => import("@/components/SharedKeywords.vue"),     
    },

    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/pages/Dashboard.vue"),
      beforeEnter: requireAuth,
    },

    {
      path: "/socialhub",
      name: "SocialHub",
      component: () => import("@/components/SocialHub.vue"),
      beforeEnter: requireAuth,
    },

    {
      path: "/lobby/:id",
      name: "Lobby",
      component: () => import("@/components/Lobby.vue"),
      beforeEnter: requireAuth,
    },

    {
      path: "/community-builds",
      name: "CommunityBuilds",
      component: () => import("@/components/CommunityBuilds.vue"),
    },

    {
      path: '/debug-interactions',
      name: 'DebugInteractions',
      component: () => import('@/components/DebugInteractions.vue')
    },

    {
      path: "/tracker-parent",
      name: "TrackerParent",
      component: () => import("@/pages/CampaignTracker.vue"),
      beforeEnter: requireAuth,
      children: [
        {
          path: "/campaign-tracker/",
          name: "Campaign Overview",
          component: () => import("@/components/CampaignOverviewView.vue"),
        },
        {
          path: "/campaign-tracker/randomizer",
          name: "Randomizer",
          component: () => import("@/components/RandomizerView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/configuration",
          name: "Configuration",
          component: () => import("@/components/ConfigurationView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/party",
          redirect: "/campaign-tracker/campaign",
        },
        {
          path: "/campaign-tracker/campaign/:id",
          name: "Campaign",
          component: () => import("@/components/CampaignView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId",
          name: "Hero",
          component: () => import("@/components/HeroDetailView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/hero/:heroId/sequential-state",
          name: "HeroSequentialState",
          component: () =>
            import("@/components/CampaignHeroSequentialAdventure.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/heroes",
          name: "HeroesManager",
          component: () => import("@/components/HeroesManager.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/hero/:heroId/sequential-state",
          name: "StandaloneHeroSequentialState",
          component: () => import("@/components/StandaloneHeroSequentialStateView.vue"), 
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/hero/:heroId",
          name: "StandaloneHero",
          component: () => import("@/components/StandaloneHeroDetailView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/keyword",
          name: "Keyword",
          component: () => import("@/components/KeywordView.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/book/:bookId",
          name: "BookView",
          component: () => import("@/components/CampaignBook.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/campaign-tracker/campaign/:campaignId/interaction/:interactionId",
          name: "InteractionView",
          component: () => import("@/components/InteractView.vue"),
          beforeEnter: requireAuth,
        },
      ],
    },

    {
      path: "/profile",
      name: "Perfil",
      component: () => import("@/pages/Perfil.vue"),
      beforeEnter: requireAuth,
      children: [
        {
          path: "/profile/home",
          name: "PerfilHome",
          component: () => import("@/components/PerfilHome.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/profile/friend-store",
          name: "search",
          component: () => import("@/components/FriendStore.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/profile/friend-storelist",
          name: "group",
          component: () => import("@/components/FriendStoreList.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/profile/settings",
          name: "settings",
          component: () => import("@/components/PerfilSettings.vue"),
          beforeEnter: requireAuth,
        },
        {
          path: "/profile/store-settings",
          name: "stores",
          component: () =>
            import("@/components/StoreSettings.vue"),
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
          component: () => import("@/components/StoreSettings.vue"),
          beforeEnter: requireAuth,
        },
      ],
    },
  ],
  // Faz rolagem suave para hashes como #01.02 quando o componente do livro renderiza
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        const tryScroll = (attempts = 0) => {
          const selector = decodeURIComponent(to.hash);
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
            resolve({ left: 0, top: 0 });
          } else if (attempts < 25) {
            setTimeout(() => tryScroll(attempts + 1), 60);
          } else {
            resolve({ left: 0, top: 0 });
          }
        };
        setTimeout(() => tryScroll(), 0);
      });
    }
    return { left: 0, top: 0 };
  },
});

export default router;