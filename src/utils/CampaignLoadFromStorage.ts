import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";

export class CampaignLoadFromStorage {
  private campaignStore = CampaignStore();
  private heroStore = HeroStore();
  private userStore = useUserStore();

  async loadCampaignComplete(campaignId: string): Promise<boolean> {
    try {
      const campaignLoaded = this.loadCampaignFromStorage(campaignId);
      const heroesLoaded = await this.loadHeroesFromBackend(campaignId);

      return campaignLoaded || heroesLoaded;
    } catch (error) {
      console.error(`Error loading campaign ${campaignId}:`, error);
      return false;
    }
  }

  private loadCampaignFromStorage(campaignId: string): boolean {
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

      return true;
    } catch (error) {
      console.error(
        `Error loading campaign from storage ${campaignId}:`,
        error,
      );
      return false;
    }
  }

  private async loadHeroesFromBackend(campaignId: string): Promise<boolean> {
    try {
      const response = await axios.get(`/playable_heroes/search`, {
        params: { 
          users_fk: this.userStore.user.users_pk 
        },
      });

      if (response.data && Array.isArray(response.data.heroes)) {
        response.data.heroes.forEach((heroEntry: any) => {
          if (heroEntry.hero_hash && heroEntry.campaigns_fk === campaignId) {
            try {
              const heroData = JSON.parse(atob(heroEntry.hero_hash));
              if (heroData.campaignId === campaignId) {
                this.mergeHeroData(heroData);
              }
            } catch (error) {
              console.error("Error decoding hero hash:", error);
            }
          }
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error(
        `Error loading heroes from backend for campaign ${campaignId}:`,
        error,
      );
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