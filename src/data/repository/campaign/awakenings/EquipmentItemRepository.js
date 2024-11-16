import {
  instanceOfArmorCardData,
  instanceOfConsumableCardData,
  instanceOfOffHandCardData,
  instanceOfWeaponCardData,
} from "@/data/repository/ItemData";
import * as _ from "lodash-es";
export class EquipmentItemRepository {
  cards = [
    {
      id: "scholars-robe",
      name: "Scholar's Robe",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Armor",
      armorTypes: ["Cloth"],
      translation_key: "armor.apocalypse.scholars-robe",
    },
    {
      id: "warworn-breastplate",
      name: "Warworn Breastplate",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Armor",
      armorTypes: ["Plate"],
      translation_key: "armor.apocalypse.warworn-breastplate",
    },
    {
      id: "veteran-cuirass",
      name: "Veteran Cuirass",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Armor",
      armorTypes: ["Leather"],
      translation_key: "armor.apocalypse.veteran-cuirass",
    },
    {
      id: "hunting-shortbow",
      name: "Hunting Shortbow",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Weapon",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.apocalypse.hunting-shortbow",
    },
    {
      id: "axe-of-the-steppes",
      name: "Axe of the Steppes",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Weapon",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.apocalypse.axe-of-the-steppes",
    },
    {
      id: "hellscarian-falchions",
      name: "Hellscarian Falchion",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Weapon",
      weaponTypes: ["Light"],
      translation_key: "weapon.apocalypse.hellscarian-falchions",
    },
    {
      id: "counselors-staff",
      name: "Counselor's Staff",
      content: "apocalypse",
      cardType: "Starting Gear",
      cardRank: null,
      cardRarity: "Normal",
      itemType: "Weapon",
      weaponTypes: ["Implement"],
      translation_key: "weapon.apocalypse.counselors-staff",
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
