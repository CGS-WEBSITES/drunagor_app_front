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
    {
      id: "ebony-chair",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Shield"],
      translation_key: "offhand.underkeep.ebony-chair",
    } as OffHandItemData,
    {
      id: "masterwork-sword",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy", "Light"],
      translation_key: "weapon.underkeep.masterwork-sword",
    } as WeaponItemData,
    {
      id: "lumberjacks-axe",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.underkeep.lumberjacks-axe",
    } as WeaponItemData,
    {
      id: "earls-shield",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Shield"],
      translation_key: "offhand.underkeep.earls-shield",
    } as OffHandItemData,
    {
      id: "elanian-crossbow",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.underkeep.elanian-crossbow",
    } as WeaponItemData,
    {
      id: "stone-gladius",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep.stone-gladius",
    } as WeaponItemData,
    {
      id: "locket-of-safeguard",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep.locket-of-safeguard",
    } as ItemData,
    {
      id: "arcane-bulwark",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Relic"],
      translation_key: "offhand.underkeep.arcane-bulwark",
    } as OffHandItemData,
    {
      id: "ritual-dagger",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Relic"],
      translation_key: "offhand.underkeep.ritual-dagger",
    } as OffHandItemData,
    {
      id: "silver-helmet",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep.silver-helmet",
    } as ItemData,
    {
      id: "elven-speellblade",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Implement"],
      translation_key: "weapon.underkeep.elven-speellblade",
    } as WeaponItemData,
    {
      id: "mirror-plate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep.mirror-plate",
    } as ArmorItemData,
    {
      id: "living-torch",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep.living-torch",
    } as ItemData,
    {
      id: "cosmic-ruby",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Gem",
      translation_key:
        "consumable.underkeep.cosmic-ruby",
    } as ConsumableItemData,
    {
      id: "lost-claymore",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.underkeep.lost-claymore",
    } as WeaponItemData,
    {
      id: "lost-claymore-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.underkeep.lost-claymore-gem",
    } as WeaponItemData,
    {
      id: "draconian-scimitar",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep.draconian-scimitar",
    } as WeaponItemData,
    {
      id: "lost-claymore-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light"],
      translation_key: "weapon.underkeep.draconian-scimitar-gem",
    } as WeaponItemData,
    {
      id: "lorelanian-longbow",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.underkeep.lorelanian-longbow",
    } as WeaponItemData,
    {
      id: "lorelanian-longbow-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.underkeep.lorelanian-longbow-gem",
    } as WeaponItemData,
    {
      id: "redwood-staff",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Implement"],
      translation_key: "weapon.underkeep.redwood-staff",
    } as WeaponItemData,
    {
      id: "redwood-staff-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Implement"],
      translation_key: "weapon.underkeep.redwood-staff-gem",
    } as WeaponItemData,
    {
      id: "astralsilk-robe",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth"],
      translation_key: "armor.underkeep.astralsilk-robe",
    } as ArmorItemData,
    {
      id: "astralsilk-robe-gem",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth"],
      translation_key: "armor.underkeep.astralsilk-robe-gem",
    } as ArmorItemData,
    {
      id: "dragonhide-cuirass",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep.dragonhide-cuirass",
    } as ArmorItemData,
    {
      id: "dragonhide-cuirass-gem",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Leather"],
      translation_key: "armor.underkeep.dragonhide-cuirass-gem",
    } as ArmorItemData,
    {
      id: "quicksilver-breastplate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep.quicksilver-breastplate",
    } as ArmorItemData,
    {
      id: "quicksilver-breastplate-gem",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Plate"],
      translation_key: "armor.underkeep.quicksilver-breastplate-gem",
    } as ArmorItemData,
    {
      id: "gravity-boots",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep.gravity-boots",
    } as ItemData,
    {
      id: "gravity-boots-gem",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.underkeep.gravity-boots-gem",
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
