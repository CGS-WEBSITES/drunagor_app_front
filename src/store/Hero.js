const resourceDefinitions = [
    { id: "focus", translation_key: "label.focus" },
    { id: "fruit-of-life", translation_key: "label.fruit-of-life" },
    { id: "ki", translation_key: "label.ki", name: "KI" },
    { id: "shield", translation_key: "label.shield" },
    { id: "fury", translation_key: "label.fury" },
];
export class HeroEquipment {
    weaponId = "";
    offHandId = "";
    armorId = "";
    trinketId = "";
    bagOneId = "";
    bagTwoId = "";
}
export class SequentialAdventureState {
    curseCubes = 0;
    traumaCubes = 0;
    resources = {};
    constructor() {
        resourceDefinitions.forEach((resource) => {
            if (!(resource.translation_key in this.resources)) {
                this.resources[resource.translation_key] = 0;
            }
        });
    }
}
export class Hero {
    heroId;
    campaignId;
    equipment = new HeroEquipment();
    stashedCardIds = [];
    skillIds = [];
    dungeonRoleSkillCubeColors = {
        rankOne: null,
        rankTwo: null,
    };
    sequentialAdventureState = null;
    auraId = null;
    outcomeIds = [];
    statusIds = [];
    constructor(heroId, campaignId) {
        this.heroId = heroId;
        this.campaignId = campaignId;
    }
}
