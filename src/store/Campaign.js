export class Campaign {
    campaignId;
    campaign;
    name = "";
    statusIds = [];
    outcomeIds = [];
    followerIds = [];
    unfoldingIds = [];
    backgroundAndTraitIds = [];
    legacyTrail = {
        perseverance: 0,
        tragedy: 0,
        doom: 0,
        heroism: 0,
    };
    isSequentialAdventure = false;
    sequentialAdventureRunes = 0;
    constructor(campaignId, campaign) {
        this.campaignId = campaignId;
        this.campaign = campaign;
    }
}
