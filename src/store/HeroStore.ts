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
    if (hero === undefined) {
      throw new Error(
        `Hero with id '${heroId}' could not be found in campaign '${campaignId}'.`,
      );
    }
    return hero;
  }

  function findInCampaignOptional(
    heroId: string,
    campaignId: string,
  ): Hero | null {
    const hero = _.find(heroes.value, {
      heroId: heroId,
      campaignId: campaignId,
    });
    return hero || null;
  }

  function findByPlayableHeroesPk(playableHeroesPk: number): Hero | null {
    const hero = _.find(heroes.value, { playableHeroesPk });
    return hero || null;
  }

  function findAllInCampaign(campaignId: string): Hero[] {
    return _.filter(
      heroes.value,
      (hero: Hero) => hero.campaignId === campaignId,
    );
  }

  function add(hero: Hero): void {
    if (hasInCampaign(hero.heroId, hero.campaignId)) {
      return;
    }
    heroes.value.push(hero);
  }

  function addOrUpdate(hero: Hero): void {
    const existingIndex = _.findIndex(heroes.value, {
      heroId: hero.heroId,
      campaignId: hero.campaignId,
    });

    if (existingIndex !== -1) {
      heroes.value[existingIndex] = { ...heroes.value[existingIndex], ...hero };
    } else {
      heroes.value.push(hero);
    }
  }

  function updateHero(
    heroId: string,
    campaignId: string,
    updates: Partial<Hero>,
  ): void {
    const hero = findInCampaignOptional(heroId, campaignId);
    if (hero) {
      Object.assign(hero, updates);
    }
  }

  function setPlayableHeroesPk(
    heroId: string,
    campaignId: string,
    playableHeroesPk: number,
  ): void {
    const hero = findInCampaignOptional(heroId, campaignId);
    if (hero) {
      hero.playableHeroesPk = playableHeroesPk;
    }
  }

  function importAndCloneHeroToCampaign(
    heroToClone: Hero,
    targetCampaignId: string,
  ): boolean {
    if (hasInCampaign(heroToClone.heroId, targetCampaignId)) {
      return false;
    }

    const newHeroInstance = _.cloneDeep(heroToClone);
    newHeroInstance.campaignId = targetCampaignId;
    newHeroInstance.playableHeroesPk = null;

    heroes.value.push(newHeroInstance);
    return true;
  }

  function removeFromCampaign(heroId: string, campaignId: string): void {
    heroes.value = heroes.value.filter((hero: Hero) => {
      return !(hero.campaignId === campaignId && hero.heroId === heroId);
    });
  }

  function clearCampaignHeroes(campaignId: string): void {
    heroes.value = heroes.value.filter(
      (hero: Hero) => hero.campaignId !== campaignId,
    );
  }

  function reset(): void {
    heroes.value = [];
  }

  return {
    heroes,
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
