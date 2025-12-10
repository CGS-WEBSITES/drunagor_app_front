import { useStorage } from "@vueuse/core";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
import type { Campaign } from "./Campaign";
import type { Hero } from "./Hero";

export const CampaignStore = defineStore("campaign", () => {
  const campaigns = useStorage("CampaignStore.campaigns", [] as Campaign[]);

  function has(campaignId: string): boolean {
    const activeCampaign = _.find(campaigns.value, { campaignId: campaignId });
    return activeCampaign !== undefined;
  }

  function find(campaignId: string): Campaign {
    const campaign = _.find(campaigns.value, { campaignId: campaignId });
    if (campaign === undefined) {
      throw new Error("Campaign could not be found: " + campaignId);
    }
    return campaign;
  }

  function findOptional(campaignId: string): Campaign | null {
    const campaign = _.find(campaigns.value, { campaignId: campaignId });
    return campaign || null;
  }

  function findAll(): Campaign[] {
    return campaigns.value;
  }

  function add(campaign: Campaign) {
    if (!campaign.heroes) {
      campaign.heroes = [];
    }
    campaigns.value.push(campaign);
  }

  function remove(campaignId: string) {
    campaigns.value = campaigns.value.filter((campaign: Campaign) => {
      return campaign.campaignId !== campaignId;
    });
  }

  function rename(campaignId: string, newName: string) {
    const campaign = find(campaignId);
    campaign.name = newName;
  }

  function updateCampaignProperty(
    campaignId: string,
    property: string,
    value: any,
  ) {
    const campaign = find(campaignId);
    (campaign as any)[property] = value;
  }

  function reset() {
    campaigns.value = [];
  }

  function hasHero(campaignId: string, heroId: string): boolean {
    const campaign = findOptional(campaignId);
    if (!campaign || !campaign.heroes) {
      return false;
    }
    return _.some(campaign.heroes, { heroId: heroId });
  }

  function findHero(campaignId: string, heroId: string): Hero {
    const campaign = find(campaignId);
    if (!campaign.heroes) {
      throw new Error(`Campaign ${campaignId} has no heroes array.`);
    }
    const hero = _.find(campaign.heroes, { heroId: heroId });
    if (hero === undefined) {
      throw new Error(
        `Hero with id '${heroId}' could not be found in campaign '${campaignId}'.`,
      );
    }
    return hero;
  }

  function findHeroOptional(campaignId: string, heroId: string): Hero | null {
    const campaign = findOptional(campaignId);
    if (!campaign || !campaign.heroes) {
      return null;
    }
    const hero = _.find(campaign.heroes, { heroId: heroId });
    return hero || null;
  }

  function findHeroByPlayableHeroesPk(
    campaignId: string,
    playableHeroesPk: number,
  ): Hero | null {
    const campaign = findOptional(campaignId);
    if (!campaign || !campaign.heroes) {
      return null;
    }
    const hero = _.find(campaign.heroes, { playableHeroesPk });
    return hero || null;
  }

  function findAllHeroes(campaignId: string): Hero[] {
    const campaign = findOptional(campaignId);
    if (!campaign || !campaign.heroes) {
      return [];
    }
    return campaign.heroes;
  }

  function addHero(campaignId: string, hero: Hero): void {
    const campaign = find(campaignId);
    if (!campaign.heroes) {
      campaign.heroes = [];
    }

    if (hasHero(campaignId, hero.heroId)) {
      console.warn(
        `[CampaignStore] Hero ${hero.heroId} already exists in campaign ${campaignId}`,
      );
      return;
    }

    hero.campaignId = campaignId;
    campaign.heroes.push(hero);
  }

  function addOrUpdateHero(campaignId: string, hero: Hero): void {
    const campaign = find(campaignId);
    if (!campaign.heroes) {
      campaign.heroes = [];
    }

    hero.campaignId = campaignId;

    const existingIndex = _.findIndex(campaign.heroes, { heroId: hero.heroId });

    if (existingIndex !== -1) {
      campaign.heroes[existingIndex] = {
        ...campaign.heroes[existingIndex],
        ...hero,
      };
    } else {
      campaign.heroes.push(hero);
    }
  }

  function updateHero(
    campaignId: string,
    heroId: string,
    updates: Partial<Hero>,
  ): void {
    const hero = findHeroOptional(campaignId, heroId);
    if (hero) {
      Object.assign(hero, updates);
    }
  }

  function setHeroPlayableHeroesPk(
    campaignId: string,
    heroId: string,
    playableHeroesPk: number,
  ): void {
    const hero = findHeroOptional(campaignId, heroId);
    if (hero) {
      hero.playableHeroesPk = playableHeroesPk;
    }
  }

  function removeHero(campaignId: string, heroId: string): void {
    const campaign = findOptional(campaignId);
    if (!campaign || !campaign.heroes) {
      return;
    }
    campaign.heroes = campaign.heroes.filter(
      (hero: Hero) => hero.heroId !== heroId,
    );
  }

  function clearHeroes(campaignId: string): void {
    const campaign = findOptional(campaignId);
    if (campaign) {
      campaign.heroes = [];
    }
  }

  function importAndCloneHeroToCampaign(
    heroToClone: Hero,
    targetCampaignId: string,
  ): boolean {
    if (hasHero(targetCampaignId, heroToClone.heroId)) {
      return false;
    }

    const newHeroInstance = _.cloneDeep(heroToClone);
    newHeroInstance.campaignId = targetCampaignId;
    newHeroInstance.playableHeroesPk = null;

    addHero(targetCampaignId, newHeroInstance);
    return true;
  }

  return {
    campaigns,

    has,
    find,
    findOptional,
    findAll,
    add,
    remove,
    rename,
    reset,
    updateCampaignProperty,

    hasHero,
    findHero,
    findHeroOptional,
    findHeroByPlayableHeroesPk,
    findAllHeroes,
    addHero,
    addOrUpdateHero,
    updateHero,
    setHeroPlayableHeroesPk,
    removeHero,
    clearHeroes,
    importAndCloneHeroToCampaign,
  };
});
