import { useStorage } from "@vueuse/core";
import * as _ from "lodash-es";
import { defineStore } from "pinia";
import type { Hero } from "./Hero"; 

export const HeroStore = defineStore("hero", () => {
  const heroes = useStorage("HeroStore.heroes", [] as Hero[]);

  function hasInCampaign(heroId: string, campaignId: string): boolean {
    const inCampaign = _.find(heroes.value, {
      heroId: heroId,
      campaignId: campaignId,
    });
    return inCampaign !== undefined;
  }

  function findInCampaign(heroId: string, campaignId: string): Hero {
    const hero = _.find(heroes.value, {
      heroId: heroId,
      campaignId: campaignId,
    });
    if (hero == undefined) {
      throw new Error(`Hero with id '${heroId}' could not be found in campaign '${campaignId}'.`);
    }
    return hero;
  }

  function findAllInCampaign(campaignId: string): Hero[] {
    return _.filter(heroes.value, (hero: Hero) => hero.campaignId === campaignId);
  }

  /**
   * @param {Hero} hero 
   */
  function add(hero: Hero): void {
    if (hasInCampaign(hero.heroId, hero.campaignId)) {
      return;
    }
    heroes.value.push(hero);
  }

  /**
   * @param {Hero} heroToClone 
   * @param {string} targetCampaignId 
   * @returns {boolean} 
   */
  function importAndCloneHeroToCampaign(heroToClone: Hero, targetCampaignId: string): boolean {
    if (hasInCampaign(heroToClone.heroId, targetCampaignId)) {
      return false; 
    }

    const newHeroInstance = _.cloneDeep(heroToClone);
    newHeroInstance.campaignId = targetCampaignId;

    heroes.value.push(newHeroInstance);
    return true; 
  }

  function removeFromCampaign(heroId: string, campaignId: string): void {
    heroes.value = heroes.value.filter((hero: Hero) => {
      return !(hero.campaignId === campaignId && hero.heroId === heroId);
    });
  }
  
  function reset(): void {
    heroes.value = [];
  }

  return {
    heroes,
    hasInCampaign,
    findInCampaign,
    findAllInCampaign,
    add,
    importAndCloneHeroToCampaign,
    removeFromCampaign,
    reset,
  };
});