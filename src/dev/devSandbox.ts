// Dev-only sandbox for /dev-preview: fake API, fake in-memory user and a
// throwaway campaign. Everything is undone when the preview is left, so the
// real app state (user, heroes, campaigns) is never touched.
import { useUserStore, type User } from "@/store/UserStore";
import { usePlayableHeroStore } from "@/store/PlayableHeroStore";
import { CampaignStore } from "@/store/CampaignStore";
import { Campaign } from "@/store/Campaign";
import { Hero } from "@/store/Hero";
import { DEV_CAMPAIGN_ID, DEV_USER_PK, disableMockApi, enableMockApi } from "@/dev/mockApi";

export type DevRole = "player" | "retailer";

const ROLE_IDS: Record<DevRole, number> = { player: 2, retailer: 3 };

let savedUser: User | null = null;

const resetPlayableHeroes = () => {
  const playableHeroStore = usePlayableHeroStore();
  playableHeroStore.heroes = [];
  playableHeroStore.loaded = false;
};

export const setDevRole = (role: DevRole) => {
  const userStore = useUserStore();
  userStore.user = {
    ...userStore.user,
    users_pk: DEV_USER_PK,
    name: "Dev Preview",
    user_name: "dev-preview",
    email: "dev-preview@example.com",
    roles_fk: ROLE_IDS[role],
    verified: true,
  };
};

export const createDevCampaign = (heroIds: string[]) => {
  const campaignStore = CampaignStore();
  campaignStore.remove(DEV_CAMPAIGN_ID);

  const campaign = new Campaign(DEV_CAMPAIGN_ID, "underkeep");
  campaign.name = "Dev Preview Adventure";
  campaign.wing = "Wing 1 Tutorial";
  campaign.door = "FIRST SETUP";
  campaign.heroes = heroIds.map((heroId) => new Hero(heroId, DEV_CAMPAIGN_ID));
  campaignStore.add(campaign);

  // Let the First Setup prompt show again on every preview visit.
  sessionStorage.removeItem(`tutorial_shown_${DEV_CAMPAIGN_ID}`);
  return campaignStore.find(DEV_CAMPAIGN_ID);
};

export const enterDevSandbox = (role: DevRole) => {
  if (!savedUser) {
    savedUser = { ...useUserStore().user };
    enableMockApi();
    resetPlayableHeroes();
  }
  setDevRole(role);
};

export const leaveDevSandbox = () => {
  if (!savedUser) return;
  CampaignStore().remove(DEV_CAMPAIGN_ID);
  resetPlayableHeroes();
  useUserStore().user = savedUser;
  savedUser = null;
  disableMockApi();
};
