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

export class UnderKeepItemDataRepository implements ItemDataRepository {
  private cards = [
    {
      id: "tools-of-the-trade",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep.tools-of-the-trade",
    } as WeaponItemData,
    {
      id: "smugglers-vest",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep.smugglers-vest",
    } as ArmorItemData,
    {
      id: "amiran-hammer",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep.amiran-hammer",
    } as WeaponItemData,
    {
      id: "clercis-mail",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep.clerics-mail",
    } as ArmorItemData,
    {
      id: "magicians-staff",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Implement", "Ranged"],
      translation_key: "weapon.underkeep.magicians-staff",
    } as WeaponItemData,
    {
      id: "elvensilk-robe",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Cloth"],
      translation_key: "armor.underkeep.elvensilk-robe",
    } as ArmorItemData,
    {
      id: "robins-crossbow",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.underkeep.robins-crossbow",
    } as WeaponItemData,
    {
      id: "hunters-cuirass",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep.hunters-cuirass",
    } as ArmorItemData,
    {
      id: "dwarven-warhammer",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.underkeep.dwarven-warhammer",
    } as WeaponItemData,
    {
      id: "dwarven-plate",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep.dwarven-plate",
    } as ArmorItemData,
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
