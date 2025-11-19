import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";

export class CampaignLoadFromStorage {
  private campaignStore = CampaignStore();
  private heroStore = HeroStore();

  loadCampaignComplete(campaignId: string): boolean {
    try {
      const storageKey = `campaign_hash_${campaignId}`;
      const hash = localStorage.getItem(storageKey);

      if (!hash) {
        console.warn(`No campaign hash found for campaign ${campaignId}`);
        return false;
      }

      const decodedData = JSON.parse(atob(hash));

      if (decodedData.campaignData) {
        if (this.campaignStore.has(campaignId)) {
          const existingCampaign = this.campaignStore.find(campaignId);
          Object.assign(existingCampaign, decodedData.campaignData);
        } else {
          this.campaignStore.add(decodedData.campaignData);
        }
      }

      if (decodedData.heroes && Array.isArray(decodedData.heroes)) {
        decodedData.heroes.forEach((heroData: any) => {
          if (heroData.campaignId === campaignId) {
            this.mergeHeroData(heroData);
          }
        });
      }

      return true;
    } catch (error) {
      console.error(`Error loading campaign ${campaignId}:`, error);
      return false;
    }
  }

  private mergeHeroData(heroData: any) {
    const { heroId, campaignId } = heroData;

    if (this.heroStore.hasInCampaign(heroId, campaignId)) {
      const existingHero = this.heroStore.findInCampaign(heroId, campaignId);

      if (heroData.equipment) {
        existingHero.equipment = {
          ...existingHero.equipment,
          ...heroData.equipment,
        };
      }

      if (heroData.stashedCardIds) {
        existingHero.stashedCardIds = heroData.stashedCardIds;
      }

      if (heroData.skillIds) {
        existingHero.skillIds = heroData.skillIds;
      }

      if (heroData.dungeonRoleSkillCubeColors) {
        existingHero.dungeonRoleSkillCubeColors =
          heroData.dungeonRoleSkillCubeColors;
      }

      if (typeof heroData.classAbilityCount !== "undefined") {
        existingHero.classAbilityCount = heroData.classAbilityCount;
      }

      if (heroData.sequentialAdventureState) {
        existingHero.sequentialAdventureState =
          heroData.sequentialAdventureState;
      }

      if (heroData.auraId !== undefined) {
        existingHero.auraId = heroData.auraId;
      }

      if (heroData.outcomeIds) {
        existingHero.outcomeIds = heroData.outcomeIds;
      }

      if (heroData.statusIds) {
        existingHero.statusIds = heroData.statusIds;
      }
    } else {
      this.heroStore.add(heroData);
    }
  }

  hasCampaignHash(campaignId: string): boolean {
    const unifiedKey = `campaign_hash_${campaignId}`;
    return localStorage.getItem(unifiedKey) !== null;
  }

  clearCampaignHashes(campaignId: string) {
    const unifiedKey = `campaign_hash_${campaignId}`;
    localStorage.removeItem(unifiedKey);

    const heroes = this.heroStore.findAllInCampaign(campaignId);
    heroes.forEach((hero) => {
      const heroKey = `hero_hash_${campaignId}_${hero.heroId}`;
      localStorage.removeItem(heroKey);
    });
  }
}
