import { CampaignStore } from "@/store/CampaignStore";
import { HeroStore } from "@/store/HeroStore";
import { useUserStore } from "@/store/UserStore";
import {
  Hero,
  SequentialAdventureState,
  RESOURCE_DEFINITIONS,
} from "@/store/Hero";
import axios from "axios";

interface PlayerData {
  rl_campaigns_users_pk: number;
  user_name: string;
  picture_hash: string;
  background_hash: string;
  party_roles_fk: number;
  role_name: string;
  playable_heroes_fk: number | null;
  events_fk: number | null;
}

interface PlayableHeroData {
  playable_heroes_pk: number;
  hero_hash: string;
  creation_date: string;
  users_fk: number;
}

interface CampaignRelationData {
  campaigns_fk: number;
  tracker_hash: string;
  start_date: string;
  conclusion_percentage: number;
  party_name: string;
  party_role: string;
  box: number;
  active: boolean;
  playable_heroes_fk: number | null;
  events_fk: number | null;
  rl_campaigns_users_pk?: number;
}

export class CampaignLoadFromStorage {
  private campaignStore = CampaignStore();
  private heroStore = HeroStore();
  private userStore = useUserStore();

  async loadCampaignComplete(campaignId: string): Promise<boolean> {
    try {
      this.heroStore.clearCampaignHeroes(campaignId);

      const campaignLoaded = await this.loadCampaignData(campaignId);

      const heroesLoaded = await this.loadCampaignHeroes(campaignId);

      return campaignLoaded || heroesLoaded;
    } catch (error) {
      console.error(
        `[CampaignLoad] Error loading campaign ${campaignId}:`,
        error,
      );
      return false;
    }
  }

  private async loadCampaignData(campaignId: string): Promise<boolean> {
    try {
      const response = await axios.get("/rl_campaigns_users/search", {
        params: {
          users_fk: this.userStore.user.users_pk,
          campaigns_fk: campaignId,
        },
      });

      if (response.data?.campaigns?.length > 0) {
        const campaignData = response.data.campaigns[0] as CampaignRelationData;

        if (campaignData.tracker_hash) {
          const decodedData = JSON.parse(atob(campaignData.tracker_hash));

          if (decodedData.campaignData) {
            const camp = decodedData.campaignData;
            camp.campaignId = campaignId;

            if (this.campaignStore.has(campaignId)) {
              const existingCampaign = this.campaignStore.find(campaignId);
              Object.assign(existingCampaign, camp);
            } else {
              this.campaignStore.add(camp);
            }

            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error(
        `[CampaignLoad] Error loading campaign data for ${campaignId}:`,
        error,
      );
      return false;
    }
  }

  private async loadCampaignHeroes(campaignId: string): Promise<boolean> {
    try {
      const playersResponse = await axios.get(
        "/rl_campaigns_users/list_players",
        {
          params: {
            campaigns_fk: campaignId,
          },
        },
      );

      if (!playersResponse.data?.Users?.length) {
        return false;
      }

      const players: PlayerData[] = playersResponse.data.Users;
      let loadedCount = 0;

      for (const player of players) {
        if (player.playable_heroes_fk) {
          try {
            const heroLoaded = await this.loadHeroByPk(
              player.playable_heroes_fk,
              campaignId,
            );
            if (heroLoaded) {
              loadedCount++;
            }
          } catch (error) {
            console.error(
              `[CampaignLoad] Error loading hero ${player.playable_heroes_fk} for player ${player.user_name}:`,
              error,
            );
          }
        }
      }
      return loadedCount > 0;
    } catch (error) {
      console.error(
        `[CampaignLoad] Error loading heroes for campaign ${campaignId}:`,
        error,
      );
      return false;
    }
  }

  private async loadHeroByPk(
    playableHeroesPk: number,
    campaignId: string,
  ): Promise<boolean> {
    try {
      const response = await axios.get(`/playable_heroes/${playableHeroesPk}`);

      if (response.data?.hero_hash) {
        const heroData = this.decodeHeroHash(response.data.hero_hash);

        if (heroData) {
          heroData.campaignId = campaignId;
          heroData.playableHeroesPk = playableHeroesPk;

          this.ensureHeroResources(heroData);
          this.heroStore.addOrUpdate(heroData);

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(
        `[CampaignLoad] Error fetching hero ${playableHeroesPk}:`,
        error,
      );
      return false;
    }
  }

  private decodeHeroHash(heroHash: string): Hero | null {
    try {
      const decoded = JSON.parse(atob(heroHash));
      return decoded as Hero;
    } catch (error) {
      console.error("[CampaignLoad] Error decoding hero hash:", error);
      return null;
    }
  }

  private ensureHeroResources(hero: Hero): void {
    if (!hero.sequentialAdventureState) {
      hero.sequentialAdventureState = new SequentialAdventureState();
    }

    if (!hero.sequentialAdventureState.resources) {
      hero.sequentialAdventureState.resources = {};
    }

    RESOURCE_DEFINITIONS.forEach((resource) => {
      if (hero.sequentialAdventureState!.resources[resource.id] === undefined) {
        hero.sequentialAdventureState!.resources[resource.id] = 0;
      }
    });
  }

  async getUserCampaignRelationPk(campaignId: string): Promise<number | null> {
    try {
      const response = await axios.get("/rl_campaigns_users/list_players", {
        params: {
          campaigns_fk: campaignId,
        },
      });

      if (response.data?.Users?.length) {
        const currentUser = response.data.Users.find(
          (u: PlayerData) => u.user_name === this.userStore.user.user_name,
        );

        if (currentUser) {
          return currentUser.rl_campaigns_users_pk;
        }
      }

      return null;
    } catch (error) {
      console.error(
        "[CampaignLoad] Error getting user campaign relation:",
        error,
      );
      return null;
    }
  }

  hasCampaignHash(campaignId: string): boolean {
    const unifiedKey = `campaign_hash_${campaignId}`;
    return localStorage.getItem(unifiedKey) !== null;
  }

  clearCampaignHashes(campaignId: string): void {
    const unifiedKey = `campaign_hash_${campaignId}`;
    localStorage.removeItem(unifiedKey);
  }
}
