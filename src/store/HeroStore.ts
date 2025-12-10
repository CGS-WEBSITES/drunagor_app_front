import { defineStore } from "pinia";
import { CampaignStore } from "./CampaignStore";
import type { Hero } from "./Hero";

export const HeroStore = defineStore("hero", () => {
  const campaignStore = CampaignStore();

  function hasInCampaign(heroId: string, campaignId: string): boolean {
    return campaignStore.hasHero(campaignId, heroId);
  }

  function findInCampaign(heroId: string, campaignId: string): Hero {
    return campaignStore.findHero(campaignId, heroId);
  }

  function findInCampaignOptional(heroId: string, campaignId: string): Hero | null {
    return campaignStore.findHeroOptional(campaignId, heroId);
  }

  function findByPlayableHeroesPk(campaignId: string, playableHeroesPk: number): Hero | null {
    return campaignStore.findHeroByPlayableHeroesPk(campaignId, playableHeroesPk);
  }

  function findAllInCampaign(campaignId: string): Hero[] {
    return campaignStore.findAllHeroes(campaignId);
  }

  function add(hero: Hero): void {
    campaignStore.addHero(hero.campaignId, hero);
  }

  function addOrUpdate(hero: Hero): void {
    campaignStore.addOrUpdateHero(hero.campaignId, hero);
  }

  function updateHero(heroId: string, campaignId: string, updates: Partial<Hero>): void {
    campaignStore.updateHero(campaignId, heroId, updates);
  }

  function setPlayableHeroesPk(heroId: string, campaignId: string, playableHeroesPk: number): void {
    campaignStore.setHeroPlayableHeroesPk(campaignId, heroId, playableHeroesPk);
  }

  function importAndCloneHeroToCampaign(heroToClone: Hero, targetCampaignId: string): boolean {
    return campaignStore.importAndCloneHeroToCampaign(heroToClone, targetCampaignId);
  }

  function removeFromCampaign(heroId: string, campaignId: string): void {
    campaignStore.removeHero(campaignId, heroId);
  }

  function clearCampaignHeroes(campaignId: string): void {
    campaignStore.clearHeroes(campaignId);
  }

  function reset(): void {
    const allCampaigns = campaignStore.findAll();
    allCampaigns.forEach((campaign) => {
      campaign.heroes = [];
    });
  }

  return {
    hasInCampaign,
    findInCampaign,
    findInCampaignOptional,
    findByPlayableHeroesPk,
    findAllInCampaign,
    add,
    addOrUpdate,
    updateHero,
    setPlayableHeroesPk,
    importAndCloneHeroToCampaign,
    removeFromCampaign,
    clearCampaignHeroes,
    reset,
  };
});