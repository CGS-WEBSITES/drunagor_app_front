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

        return this.loadFromLegacyHashes(campaignId);
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

      return this.loadFromLegacyHashes(campaignId);
    }
  }

  private loadFromLegacyHashes(campaignId: string): boolean {
    let loadedAny = false;

    const oldCampaignKey = `campaign_hash_${campaignId}`;
    const oldCampaignHash = localStorage.getItem(oldCampaignKey);

    if (oldCampaignHash) {
      try {
        const decodedData = JSON.parse(atob(oldCampaignHash));

        if (decodedData.campaignData) {
          if (this.campaignStore.has(campaignId)) {
            const existingCampaign = this.campaignStore.find(campaignId);
            Object.assign(existingCampaign, decodedData.campaignData);
          } else {
            this.campaignStore.add(decodedData.campaignData);
          }

          loadedAny = true;
        }
      } catch (error) {
        console.error("Error loading legacy campaign hash:", error);
      }
    }

    const allHeroesKey = `heroes_hash_${campaignId}`;
    const allHeroesHash = localStorage.getItem(allHeroesKey);

    if (allHeroesHash) {
      try {
        const decodedData = JSON.parse(atob(allHeroesHash));

        if (decodedData.heroes && Array.isArray(decodedData.heroes)) {
          decodedData.heroes.forEach((heroData: any) => {
            if (heroData.campaignId === campaignId) {
              this.mergeHeroData(heroData);
            }
          });

          loadedAny = true;
        }
      } catch (error) {
        console.error("Error loading legacy heroes hash:", error);
      }
    }

    const currentHeroes = this.heroStore.findAllInCampaign(campaignId);

    currentHeroes.forEach((hero) => {
      const individualKey = `hero_hash_${campaignId}_${hero.heroId}`;
      const individualHash = localStorage.getItem(individualKey);

      if (individualHash) {
        try {
          const decodedData = JSON.parse(atob(individualHash));

          if (decodedData.heroes && decodedData.heroes.length > 0) {
            this.mergeHeroData(decodedData.heroes[0]);
            loadedAny = true;
          }
        } catch (error) {
          console.error(
            `Error loading legacy individual hero hash for ${hero.heroId}:`,
            error,
          );
        }
      }
    });

    if (loadedAny) {
      this.migrateToUnifiedHash(campaignId);
    }

    return loadedAny;
  }

  private migrateToUnifiedHash(campaignId: string) {
    try {
      const campaign = this.campaignStore.find(campaignId);
      const heroes = this.heroStore.findAllInCampaign(campaignId);

      if (!campaign) {
        console.warn(
          `Cannot migrate - campaign ${campaignId} not found in store`,
        );
        return;
      }

      const unifiedData = {
        campaignData: JSON.parse(JSON.stringify(campaign)),
        heroes: heroes.map((h) => JSON.parse(JSON.stringify(h))),
        savedAt: new Date().toISOString(),
        migratedFrom: "legacy",
      };

      const unifiedHash = btoa(JSON.stringify(unifiedData));
      const storageKey = `campaign_hash_${campaignId}`;
      localStorage.setItem(storageKey, unifiedHash);

      const oldHeroesKey = `heroes_hash_${campaignId}`;
      localStorage.removeItem(oldHeroesKey);

      heroes.forEach((hero) => {
        const oldKey = `hero_hash_${campaignId}_${hero.heroId}`;
        localStorage.removeItem(oldKey);
      });
    } catch (error) {
      console.error(
        `Error migrating campaign ${campaignId} to unified hash:`,
        error,
      );
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

    if (localStorage.getItem(unifiedKey) !== null) {
      return true;
    }

    const heroesKey = `heroes_hash_${campaignId}`;
    return localStorage.getItem(heroesKey) !== null;
  }


  clearCampaignHashes(campaignId: string) {
    const unifiedKey = `campaign_hash_${campaignId}`;
    localStorage.removeItem(unifiedKey);

    const heroesKey = `heroes_hash_${campaignId}`;
    localStorage.removeItem(heroesKey);

    const heroes = this.heroStore.findAllInCampaign(campaignId);
    heroes.forEach((hero) => {
      const heroKey = `hero_hash_${campaignId}_${hero.heroId}`;
      localStorage.removeItem(heroKey);
    });
  }
}
