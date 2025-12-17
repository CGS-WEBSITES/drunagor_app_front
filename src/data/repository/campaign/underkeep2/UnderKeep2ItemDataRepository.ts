import type {
  ArmorItemData,
  ConsumableItemData,
  ItemData,
  OffHandItemData,
  WeaponItemData,
} from "@/data/repository/ItemData";
import {
  instanceOfArmorCardData,
  instanceOfConsumableCardData,
  instanceOfOffHandCardData,
  instanceOfWeaponCardData,
} from "@/data/repository/ItemData";
import type { ItemDataRepository } from "@/data/repository/ItemDataRepository";
import type { ArmorType } from "@/data/type/ArmorType";
import type { ConsumableType } from "@/data/type/ConsumableType";
import type { ItemType } from "@/data/type/ItemType";
import type { OffHandType } from "@/data/type/OffHandType";
import type { WeaponType } from "@/data/type/WeaponType";
import * as _ from "lodash-es";

export class UnderKeep2ItemDataRepository implements ItemDataRepository {
  private cards = [
    {
      id: "tools-of-the-trade",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep2.tools-of-the-trade",
    } as WeaponItemData,
    {
      id: "smugglers-vest",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep2.smugglers-vest",
    } as ArmorItemData,
    {
      id: "amiran-hammer",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep2.amiran-hammer",
    } as WeaponItemData,
    {
      id: "clercis-mail",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep2.clerics-mail",
    } as ArmorItemData,
    {
      id: "magicians-staff",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Implement", "Ranged"],
      translation_key: "weapon.underkeep2.magicians-staff",
    } as WeaponItemData,
    {
      id: "elvensilk-robe",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Cloth"],
      translation_key: "armor.underkeep2.elvensilk-robe",
    } as ArmorItemData,
    {
      id: "robins-crossbow",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.underkeep2.robins-crossbow",
    } as WeaponItemData,
    {
      id: "hunters-cuirass",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep2.hunters-cuirass",
    } as ArmorItemData,
    {
      id: "dwarven-warhammer",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.underkeep2.dwarven-warhammer",
    } as WeaponItemData,
    {
      id: "dwarven-plate",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep2.dwarven-plate",
    } as ArmorItemData,
    {
      id: "weapon-of-the-ancients",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy", "Ranged", "Implement"],
      translation_key: "weapon.underkeep2.weapon-of-the-ancients",
    } as WeaponItemData,
    {
      id: "dragon-gem",
      itemType: "Consumable",
      consumableType: "Gem",
      translation_key: "consumable.underkeep2.dragon-gem",
    } as ConsumableItemData,
    {
      id: "dawn-silverchain",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth", "Leather", "Plate"],
      translation_key: "armor.underkeep2.dawn-silverchain",
    } as ArmorItemData,
    {
      id: "noon-plate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth", "Leather", "Plate"],
      translation_key: "armor.underkeep2.noon-plate",
    } as ArmorItemData,
    {
      id: "twilight-leather",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth", "Leather", "Plate"],
      translation_key: "armor.underkeep2.twilight-leather",
    } as ArmorItemData,
    {
      id: "night-plate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth", "Leather", "Plate"],
      translation_key: "armor.underkeep2.night-plate",
    } as ArmorItemData,
    {
      id: "callix-malt",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.callix-malt",
    } as ConsumableItemData,
    {
      id: "searing-wort",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.searing-wort",
    } as ConsumableItemData,
    {
      id: "zullan-malt",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.zullan-malt",
    } as ConsumableItemData,
    {
      id: "refreshing-wort",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.refreshing-wort",
    } as ConsumableItemData,
    {
      id: "aral-malt",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.aral-malt",
    } as ConsumableItemData,
    {
      id: "strong-wort",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.strong-wort",
    } as ConsumableItemData,
    {
      id: "breath-of-summer",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Tools",
      translation_key: "consumable.underkeep2.breath-of-summer",
    } as ConsumableItemData,
    {
      id: "breath-of-winter",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Tools",
      translation_key: "consumable.underkeep2.breath-of-winter",
    } as ConsumableItemData,
    {
      id: "callix-red-beer",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.callix-red-beer",
    } as ConsumableItemData,
    {
      id: "zullan-weiss-beer",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.zullan-weiss-beer",
    } as ConsumableItemData,
    {
      id: "aral-stout-beer",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.aral-stout-beer",
    } as ConsumableItemData,
  ];

  find(cardId: string): ItemData | undefined {
    return _.find(this.cards, { id: cardId });
  }

  findAll(): ItemData[] {
    return this.cards;
  }

  findByType(
    type: ItemType,
    subType:
      | ArmorType
      | ConsumableType
      | OffHandType
      | WeaponType
      | null = null,
  ): ItemData[] {
    const cards: ItemData[] = [];

    const isSubType = function (
      item: ItemData,
      st: ArmorType | ConsumableType | OffHandType | WeaponType | null,
    ): boolean {
      if (st === null) {
        return true;
      }

      if (instanceOfArmorCardData(item)) {
        return (item as ArmorItemData).armorTypes.some((value) => value === st);
      }
      if (instanceOfConsumableCardData(item)) {
        return (item as ConsumableItemData).consumableType === st;
      }
      if (instanceOfOffHandCardData(item)) {
        return (item as OffHandItemData).offHandTypes.some(
          (value) => value === st,
        );
      }
      if (instanceOfWeaponCardData(item)) {
        return (item as WeaponItemData).weaponTypes.some(
          (value) => value === st,
        );
      }
      return false;
    };

    this.cards.forEach((card) => {
      const c = card as ItemData;
      if (c.itemType === type && (subType == null || isSubType(c, subType))) {
        cards.push(c);
      }
    });

    return cards;
  }
}