export class Campaign {
  public campaignId: string;
  public campaign: "core" | "apocalypse" | "awakenings" | "underkeep" | "underkeep2";
  public name: string = "";
  public door: string = "";
  public wing: string = "";
  public statusIds: string[] = [];
  public outcomeIds: string[] = [];
  public followerIds: string[] = [];
  public unfoldingIds: string[] = [];
  public backgroundAndTraitIds: string[] = [];
  public runeCardIds: number[] = [];
  public hasCompanionHero: boolean = false;
  public companionHeroStatus: string | null = null;
  public legacyTrail: {
    perseverance: number;
    tragedy: number;
    doom: number;
    heroism: number;
  } = {
    perseverance: 0,
    tragedy: 0,
    doom: 0,
    heroism: 0,
  };
  public isSequentialAdventure: boolean = false;
  public sequentialAdventureRunes: number = 0;

  constructor(
    campaignId: string,
    campaign: "core" | "apocalypse" | "awakenings" | "underkeep" | "underkeep2",
  ) {
    this.campaignId = campaignId;
    if (campaign) {
      this.campaign = campaign;
    }
  }
}