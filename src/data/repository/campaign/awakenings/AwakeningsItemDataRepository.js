import { instanceOfArmorCardData, instanceOfConsumableCardData, instanceOfOffHandCardData, instanceOfWeaponCardData, } from "@/data/repository/ItemData";
import * as _ from "lodash-es";
export class AwakeningsItemDataRepository {
    cards = [
        {
            id: "accuracy-ring",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.accuracy-ring",
        },
        {
            id: "arcabalest",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged", "Implement"],
            translation_key: "weapon.awakenings.arcabalest",
        },
        {
            id: "astral-symbol",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic"],
            translation_key: "offhand.awakenings.astral-symbol",
        },
        {
            id: "buckler",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon", "Shield"],
            translation_key: "offhand.awakenings.buckler",
        },
        {
            id: "chaos-staff",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Implement"],
            translation_key: "weapon.awakenings.chaos-staff",
        },
        {
            id: "cleavescythe",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Heavy"],
            translation_key: "weapon.awakenings.cleavescythe",
        },
        {
            id: "cornucopia",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.cornucopia",
        },
        {
            id: "artisans-tools",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Tools",
            translation_key: "consumable.awakenings.artisans-tools",
        },
        {
            id: "azure-robins-knife",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Relic"],
            translation_key: "offhand.awakenings.azure-robins-knife",
        },
        {
            id: "arcane-glove",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.arcane-glove",
        },
        {
            id: "battle-plate",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Plate"],
            translation_key: "armor.awakenings.battle-plate",
        },
        {
            id: "black-harpoon",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.black-harpoon",
        },
        {
            id: "bright-crest",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.bright-crest",
        },
        {
            id: "captains-brooch",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.captains-brooch",
        },
        {
            id: "christis-kitten",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.christis-kitten",
        },
        {
            id: "combustible-grenade",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Potion",
            translation_key: "consumable.awakenings.combustible-grenade",
        },
        {
            id: "cosmic-heart-chipped",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.cosmic-heart-chipped",
        },
        {
            id: "cosmic-heart-flawless",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.cosmic-heart-flawless",
        },
        {
            id: "defenders-buckler-back",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
            translation_key: "offhand.awakenings.defenders-buckler-back",
        },
        {
            id: "defenders-buckler-front",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
            translation_key: "offhand.awakenings.defenders-buckler-front",
        },
        {
            id: "dragons-breath",
            itemType: "Consumable",
            cardType: "Adventure",
            consumableType: "Potion",
            translation_key: "consumable.awakenings.dragons-breath",
        },
        {
            id: "eradrens-lamp",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.eradrens-lamp",
        },
        {
            id: "exquisite-mail",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Plate"],
            translation_key: "armor.awakenings.exquisite-mail",
        },
        {
            id: "felix-felis",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.felix-felis",
        },
        {
            id: "fighters-ring-back",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.fighters-ring-back",
        },
        {
            id: "fighters-ring-front",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.fighters-ring-front",
        },
        {
            id: "grimoire",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.grimoire",
        },
        {
            id: "hack-slash",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light", "Heavy"],
            translation_key: "weapon.awakenings.hack-slash",
        },
        {
            id: "heart-of-the-ocean",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
            translation_key: "offhand.awakenings.heart-of-the-ocean",
        },
        {
            id: "heavy-shield",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Shield"],
            translation_key: "offhand.awakenings.heavy-shield",
        },
        {
            id: "hippocampus-banner",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
            translation_key: "offhand.awakenings.hippocampus-banner",
        },
        {
            id: "holy-aegis",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic", "Shield"],
            translation_key: "offhand.awakenings.holy-aegis",
        },
        {
            id: "huntmasters-whistle",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.huntmasters-whistle",
        },
        {
            id: "improved-mystics-robe",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth"],
            translation_key: "armor.awakenings.improved-mystics-robe",
        },
        {
            id: "improved-rogues-vest",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Leather"],
            translation_key: "armor.awakenings.improved-rogues-vest",
        },
        {
            id: "improved-battle-plate",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Plate"],
            translation_key: "armor.awakenings.improved-battle-plate",
        },
        {
            id: "improved-exquisite-mail",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Plate"],
            translation_key: "armor.awakenings.improved-exquisite-mail",
        },
        {
            id: "improved-quilted-doublet",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Leather"],
            translation_key: "armor.awakenings.improved-quilted-doublet",
        },
        {
            id: "improved-astral-symbol",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic"],
            translation_key: "offhand.awakenings.improved-astral-symbol",
        },
        {
            id: "improved-heavy-shield",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Shield"],
            translation_key: "offhand.awakenings.improved-heavy-shield",
        },
        {
            id: "improved-skull-piercer",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon"],
            translation_key: "offhand.awakenings.improved-skull-piercer",
        },
        {
            id: "improved-holy-aegis",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic", "Shield"],
            translation_key: "offhand.awakenings.improved-holy-aegis",
        },
        {
            id: "improved-buckler",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon", "Shield"],
            translation_key: "offhand.awakenings.improved-buckler",
        },
        {
            id: "improved-hack-slash",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light", "Heavy"],
            translation_key: "weapon.awakenings.improved-hack-slash",
        },
        {
            id: "improved-twin-blades",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light"],
            translation_key: "weapon.awakenings.improved-twin-blades",
        },
        {
            id: "improved-cleavescythe",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Heavy"],
            translation_key: "weapon.awakenings.improved-cleavescythe",
        },
        {
            id: "improved-chaos-staff",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Implement"],
            translation_key: "weapon.awakenings.improved-chaos-staff",
        },
        {
            id: "improved-war-bow",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged"],
            translation_key: "weapon.awakenings.improved-war-bow",
        },
        {
            id: "improved-arcabalest",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged", "Implement"],
            translation_key: "weapon.awakenings.improved-arcabalest",
        },
        {
            id: "improved-accuracy-ring",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.improved-accuracy-ring",
        },
        {
            id: "improved-tracker-boots",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.improved-tracker-boots",
        },
        {
            id: "improved-cornucopia",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.improved-cornucopia",
        },
        {
            id: "improved-grimoire",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.improved-grimoire",
        },
        {
            id: "loriens-flute",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.loriens-flute",
        },
        {
            id: "mind-gem",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.mind-gem",
        },
        {
            id: "mystics-robe",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth"],
            translation_key: "armor.awakenings.mystics-robe",
        },
        {
            id: "ominous-spearhead",
            itemType: "Off Hand",
            cardType: "Adventure",
            offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
            translation_key: "offhand.awakenings.ominous-spearhead",
        },
        {
            id: "potion-of-haste",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Potion",
            translation_key: "consumable.awakenings.potion-of-haste",
        },
        {
            id: "potion-of-strength",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Potion",
            translation_key: "consumable.awakenings.potion-of-strength",
        },
        {
            id: "polished-helmet",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.polished-helmet",
        },
        {
            id: "scroll-of-beguile",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Scroll",
            translation_key: "consumable.awakenings.scroll-of-beguile",
        },
        {
            id: "scroll-of-polymorph",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Scroll",
            translation_key: "consumable.awakenings.scroll-of-polymorph",
        },
        {
            id: "scroll-of-protection",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Scroll",
            translation_key: "consumable.awakenings.scroll-of-protection",
        },
        {
            id: "skull-piercer",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon"],
            translation_key: "offhand.awakenings.skull-piercer",
        },
        {
            id: "token-of-friendship",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.token-of-friendship",
        },
        {
            id: "tracker-boots",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.tracker-boots",
        },
        {
            id: "trappers-toolkit",
            itemType: "Trinket",
            cardType: "Adventure",
            translation_key: "trinket.awakenings.trappers-toolkit",
        },
        {
            id: "treasure-trove",
            itemType: "Consumable",
            cardType: "Chest",
            consumableType: "Treasure",
            translation_key: "consumable.awakenings.treasure-trove",
        },
        {
            id: "twin-blades",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light"],
            translation_key: "weapon.awakenings.twin-blades",
        },
        {
            id: "quilted-doublet",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Leather"],
            translation_key: "armor.awakenings.quilted-doublet",
        },
        {
            id: "rancor-blade",
            itemType: "Weapon",
            cardType: "Adventure",
            weaponTypes: ["Heavy", "Light"],
            translation_key: "weapon.awakenings.rancor-blade",
        },
        {
            id: "rogues-vest",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Leather"],
            translation_key: "armor.awakenings.rogues-vest",
        },
        {
            id: "ultimate-mystics-robe",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth"],
            translation_key: "armor.awakenings.ultimate-mystics-robe",
        },
        {
            id: "ultimate-rogues-vest",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Leather"],
            translation_key: "armor.awakenings.ultimate-rogues-vest",
        },
        {
            id: "ultimate-battle-plate",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Plate"],
            translation_key: "armor.awakenings.ultimate-battle-plate",
        },
        {
            id: "ultimate-exquisite-mail",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Plate"],
            translation_key: "armor.awakenings.ultimate-exquisite-mail",
        },
        {
            id: "ultimate-quilted-doublet",
            itemType: "Armor",
            cardType: "Camp Item",
            armorTypes: ["Cloth", "Leather"],
            translation_key: "armor.awakenings.ultimate-quilted-doublet",
        },
        {
            id: "ultimate-astral-symbol",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic"],
            translation_key: "offhand.awakenings.ultimate-astral-symbol",
        },
        {
            id: "ultimate-heavy-shield",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Shield"],
            translation_key: "offhand.awakenings.ultimate-heavy-shield",
        },
        {
            id: "ultimate-skull-piercer",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon"],
            translation_key: "offhand.awakenings.ultimate-skull-piercer",
        },
        {
            id: "ultimate-holy-aegis",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Relic", "Shield"],
            translation_key: "offhand.awakenings.ultimate-holy-aegis",
        },
        {
            id: "ultimate-buckler",
            itemType: "Off Hand",
            cardType: "Camp Item",
            offHandTypes: ["Off Hand Weapon", "Shield"],
            translation_key: "offhand.awakenings.ultimate-buckler",
        },
        {
            id: "ultimate-hack-slash",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light", "Heavy"],
            translation_key: "weapon.awakenings.ultimate-hack-slash",
        },
        {
            id: "ultimate-twin-blades",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Light"],
            translation_key: "weapon.awakenings.ultimate-twin-blades",
        },
        {
            id: "ultimate-cleavescythe",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Heavy"],
            translation_key: "weapon.awakenings.ultimate-cleavescythe",
        },
        {
            id: "ultimate-chaos-staff",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Implement"],
            translation_key: "weapon.awakenings.ultimate-chaos-staff",
        },
        {
            id: "ultimate-war-bow",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged"],
            translation_key: "weapon.awakenings.ultimate-war-bow",
        },
        {
            id: "ultimate-arcabalest",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged", "Implement"],
            translation_key: "weapon.awakenings.ultimate-arcabalest",
        },
        {
            id: "ultimate-accuracy-ring",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.ultimate-accuracy-ring",
        },
        {
            id: "ultimate-tracker-boots",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.ultimate-tracker-boots",
        },
        {
            id: "ultimate-cornucopia",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.ultimate-cornucopia",
        },
        {
            id: "ultimate-grimoire",
            itemType: "Trinket",
            cardType: "Camp Item",
            translation_key: "trinket.awakenings.ultimate-grimoire",
        },
        {
            id: "war-bow",
            itemType: "Weapon",
            cardType: "Camp Item",
            weaponTypes: ["Ranged"],
            translation_key: "weapon.awakenings.war-bow",
        },
    ];
    find(cardId) {
        return _.find(this.cards, { id: cardId });
    }
    findAll() {
        return this.cards;
    }
    findByType(type, subType = null) {
        const cards = [];
        const isSubType = function (item, st) {
            if (st === null) {
                return true;
            }
            if (instanceOfArmorCardData(item)) {
                return item.armorTypes.some((value) => value === st);
            }
            if (instanceOfConsumableCardData(item)) {
                return item.consumableType === st;
            }
            if (instanceOfOffHandCardData(item)) {
                return item.offHandTypes.some((value) => value === st);
            }
            if (instanceOfWeaponCardData(item)) {
                return item.weaponTypes.some((value) => value === st);
            }
            return false;
        };
        this.cards.forEach((card) => {
            const c = card;
            if (c.itemType === type && (subType == null || isSubType(c, subType))) {
                cards.push(c);
            }
        });
        return cards;
    }
}
