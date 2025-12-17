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
    // --- Starting Gear ---
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
      id: "clerics-mail",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep2.clerics-mail",
    } as ArmorItemData,
    {
      id: "magicians-staff",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Implement"], 
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

    // --- Adventure Gear (Weapons & Armor) ---
    {
      id: "weapon-of-the-ancients",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy", "Ranged", "Implement"],
      translation_key: "weapon.underkeep2.weapon-of-the-ancients",
    } as WeaponItemData,
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

    // --- Consumables ---
    {
      id: "scroll-of-incinerate",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Scroll",
      translation_key: "consumable.underkeep2.scroll-of-incinerate",
    } as ConsumableItemData,
    {
      id: "potion-of-rejuvenation",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.potion-of-rejuvenation",
    } as ConsumableItemData,
    {
      id: "scroll-of-winter",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Scroll",
      translation_key: "consumable.underkeep2.scroll-of-winter",
    } as ConsumableItemData,
    {
      id: "potion-of-strength",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.potion-of-strength",
    } as ConsumableItemData,
    {
      id: "scroll-of-sudden-death",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Scroll",
      translation_key: "consumable.underkeep2.scroll-of-sudden-death",
    } as ConsumableItemData,
    {
      id: "potion-of-concentration",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.potion-of-concentration",
    } as ConsumableItemData,
    {
      id: "explosive-brew",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion", 
      translation_key: "consumable.underkeep2.explosive-brew",
    } as ConsumableItemData,
    {
      id: "winter-brew",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Potion",
      translation_key: "consumable.underkeep2.winter-brew",
    } as ConsumableItemData,
    {
      id: "dragon-gem",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Gem", 
      translation_key: "consumable.underkeep2.dragon-gem",
    } as ConsumableItemData,
    {
      id: "callix-fire-beer",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep2.callix-fire-beer",
    } as ItemData,
    {
      id: "zullan-rush-beer",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep2.zullan-rush-beer",
    } as ItemData,
    {
      id: "cormack-house-crest",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep2.cormack-house-crest",
    } as ItemData,
    {
      id: "quicksilver-ring",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep2.quicksilver-ring",
    } as ItemData,
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