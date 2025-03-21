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

export class CoreItemDataRepository implements ItemDataRepository {
  private cards = [
    {
      id: "amiran-crossbow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.amiran-crossbow",
    } as WeaponItemData,
    {
      id: "amiran-halberd",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy", "Light"],
      translation_key: "weapon.core.amiran-halberd",
    } as WeaponItemData,
    {
      id: "amiran-royal-maul",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.amiran-royal-maul",
    } as WeaponItemData,
    {
      id: "amulet-of-power",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.amulet-of-power",
    } as ItemData,
    {
      id: "amulet-of-rewinding",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.amulet-of-rewinding",
    } as ItemData,
    {
      id: "amulet-of-the-copycat",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.amulet-of-the-copycat",
    } as ItemData,
    {
      id: "badge-of-the-wardens",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.badge-of-the-wardens",
    } as ItemData,
    {
      id: "bane-of-the-shadows",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.undeaddragon.bane-of-the-shadows",
    } as WeaponItemData,
    {
      id: "battle-maul",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.battle-maul",
    } as WeaponItemData,
    {
      id: "blacksteel-blade",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.blacksteel-blade",
    } as WeaponItemData,
    {
      id: "blacksteel-greatsword",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.blacksteel-greatsword",
    } as WeaponItemData,
    {
      id: "blacksteel-longsword",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.blacksteel-longsword",
    } as WeaponItemData,
    {
      id: "blooded-sword",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.blooded-sword",
    } as WeaponItemData,
    {
      id: "bloody-axe-cosmic-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.bloody-axe-cosmic-gem",
    } as WeaponItemData,
    {
      id: "bloody-axe-socketed",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.bloody-axe-socketed",
    } as WeaponItemData,
    {
      id: "blue-flame-torch",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.blue-flame-torch",
    } as ItemData,
    {
      id: "bond of superation",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.bond-of-superation",
    } as ItemData,
    {
      id: "badge-of-the-west-wind",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.badge-of-the-west-wind",
    } as ItemData,
    {
      id: "boots-of-agility",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.boots-of-agility",
    } as ItemData,
    {
      id: "boots-of-levitation",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.boots-of-levitation",
    } as ItemData,
    {
      id: "boots-of-striding",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.boots-of-striding",
    } as ItemData,
    {
      id: "bracers-of-endurance",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.bracers-of-endurance",
    } as ItemData,
    {
      id: "breastplate",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.breastplate",
    } as ArmorItemData,
    {
      id: "broken-phylactery",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.broken-phylactery",
    } as ItemData,
    {
      id: "cloth-armor",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.cloth-armor",
    } as ArmorItemData,
    {
      id: "corruptor-knife",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.corruptor-knife",
    } as WeaponItemData,
    {
      id: "cosmic-gemstone",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Gem",
      translation_key: "consumable.core.cosmic-gemstone",
    } as ConsumableItemData,
    {
      id: "cosmic-gemstone-chest",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Gem",
      translation_key: "consumable.core.cosmic-gemstone-chest",
    } as ConsumableItemData,
    {
      id: "cosmic-gemstone-from-sigil-of-honor",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Gem",
      translation_key: "consumable.core.cosmic-gemstone-from-sigil-of-honor",
    } as ConsumableItemData,
    {
      id: "crossbow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.crossbow",
    } as WeaponItemData,
    {
      id: "cursed-bracelet",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.cursed-bracelet",
    } as ItemData,
    {
      id: "dark-piercer",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy", "Light"],
      translation_key: "weapon.undeaddragon.dark-piercer",
    } as WeaponItemData,
    {
      id: "deadly-backstabber",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.deadly-backstabber",
    } as OffHandItemData,
    {
      id: "deft-stilleto",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.deft-stilleto",
    } as OffHandItemData,
    {
      id: "dewey-and-guss-collar",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.dewey-and-guss-collar",
    } as ItemData,
    {
      id: "displacement-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.displacement-cloak",
    } as ArmorItemData,
    {
      id: "dragon-eye-of-memory",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.undeaddragon.dragon-eye-of-memory",
    } as ItemData,
    {
      id: "dragonbone-wand",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon", "Relic"],
      translation_key: "offhand.desertofhellscar.dragonbone-wand",
    } as OffHandItemData,
    {
      id: "dragonclaw-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic", "Shield"],
      translation_key: "offhand.undeaddragon.dragonclaw-shield",
    } as OffHandItemData,
    {
      id: "dream-weaveplate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Cloth", "Plate"],
      translation_key: "armor.core.dream-weaveplate",
    } as ArmorItemData,
    {
      id: "dreamcrafted-buckler",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Shield"],
      translation_key: "offhand.core.dreamcrafted-buckler",
    } as OffHandItemData,
    {
      id: "dreamcrafted-pattern-bracers-of-endurance",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key:
        "consumable.core.dreamcrafted-pattern-bracers-of-endurance",
    } as ConsumableItemData,
    {
      id: "dreamcrafted-pattern-dream-weaveplate",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key: "consumable.core.dreamcrafted-pattern-dream-weaveplate",
    } as ConsumableItemData,
    {
      id: "dreamcrafted-pattern-dreamcrafted-buckler",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key:
        "consumable.core.dreamcrafted-pattern-dreamcrafted-buckler",
    } as ConsumableItemData,
    {
      id: "dreamcrafted-pattern-dreampiercer-bow",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key: "consumable.core.dreamcrafted-pattern-dreampiercer-bow",
    } as ConsumableItemData,
    {
      id: "dreamcrafted-pattern-exquisite-dreamblade",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key:
        "consumable.core.dreamcrafted-pattern-exquisite-dreamblade",
    } as ConsumableItemData,
    {
      id: "dreamcrafted-pattern-sigil-of-narangerel",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Pattern",
      translation_key:
        "consumable.core.dreamcrafted-pattern-sigil-of-narangerel",
    } as ConsumableItemData,
    {
      id: "dreampiercer-bow",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Implement", "Ranged"],
      translation_key: "weapon.core.dreampiercer-bow",
    } as WeaponItemData,
    {
      id: "dueling-dagger",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.dueling-dagger",
    } as OffHandItemData,
    {
      id: "dwarven-kings-sword-cosmic-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.dwarven-kings-sword-cosmic-gem",
    } as WeaponItemData,
    {
      id: "dwarven-kings-sword-socketed",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.dwarven-kings-sword-socketed",
    } as WeaponItemData,
    {
      id: "elvish-bow",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.elvish-bow",
    } as WeaponItemData,
    {
      id: "empowered-pact-blade",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.empowered-pact-blade",
    } as OffHandItemData,
    {
      id: "enchanted-crossbow-cosmic-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Ranged", "Implement"],
      translation_key: "weapon.core.enchanted-crossbow-cosmic-gem",
    } as WeaponItemData,
    {
      id: "enchanted-crossbow-socketed",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Ranged", "Implement"],
      translation_key: "weapon.core.enchanted-crossbow-socketed",
    } as WeaponItemData,
    {
      id: "exquisite-dreamblade",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Heavy", "Light"],
      translation_key: "weapon.core.exquisite-dreamblade",
    } as WeaponItemData,
    {
      id: "family-locket-cosmic-gem",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.family-locket-cosmic-gem",
    } as ItemData,
    {
      id: "family-locket-socketed",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.family-locket-socketed",
    } as ItemData,
    {
      id: "frozen-tears-of-alagast",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.desertofhellscar.frozen-tears-of-alagast",
    } as ItemData,
    {
      id: "full-plate-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.full-plate-armor",
    } as ArmorItemData,
    {
      id: "gold-medal",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.gold-medal",
    } as ItemData,
    {
      id: "golden-locket",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.golden-locket",
    } as ItemData,
    {
      id: "good-quality-stick",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.good-quality-stick",
    } as ItemData,
    {
      id: "good-quality-torch",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.good-quality-torch",
    } as ItemData,
    {
      id: "greater-displacement-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.greater-displacement-cloak",
    } as ArmorItemData,
    {
      id: "greater-mystical-symbol",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.greater-mystical-symbol",
    } as OffHandItemData,
    {
      id: "greater-spellweave-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.greater-spellweave-cloak",
    } as ArmorItemData,
    {
      id: "greater-symbol-of-light",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.greater-symbol-of-light",
    } as OffHandItemData,
    {
      id: "half-plate-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.half-plate-armor",
    } as ArmorItemData,
    {
      id: "heavy-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.heavy-shield",
    } as OffHandItemData,
    {
      id: "heavy-thornmail",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.heavy-thornmail",
    } as ArmorItemData,
    {
      id: "hellscarian-short-bow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.hellscarian-short-bow",
    } as WeaponItemData,
    {
      id: "iron-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.iron-shield",
    } as OffHandItemData,
    {
      id: "jagged-blade-axe",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.jagged-blade-axe",
    } as WeaponItemData,
    {
      id: "kite-shield-cosmic-gem",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.kite-shield-cosmic-gem",
    } as OffHandItemData,
    {
      id: "kite-shield-socketed",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.kite-shield-socketed",
    } as OffHandItemData,
    {
      id: "leather-armor",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Leather"],
      translation_key: "armor.core.leather-armor",
    } as ArmorItemData,
    {
      id: "lesser-displacement-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.lesser-displacement-cloak",
    } as ArmorItemData,
    {
      id: "lesser-mystical-symbol",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.lesser-mystical-symbol",
    } as OffHandItemData,
    {
      id: "lesser-spellweave-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.lesser-spellweave-cloak",
    } as ArmorItemData,
    {
      id: "lesser-symbol-of-light",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.lesser-symbol-of-light",
    } as OffHandItemData,
    {
      id: "light-maul",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.light-maul",
    } as WeaponItemData,
    {
      id: "light-thornmail",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.light-thornmail",
    } as ArmorItemData,
    {
      id: "lovers-promise",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.lovers-promise",
    } as ItemData,
    {
      id: "marksman-bow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.marksman-bow",
    } as WeaponItemData,
    {
      id: "moonlight-dagger",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon", "Relic"],
      translation_key: "offhand.undeaddragon.moonlight-dagger",
    } as OffHandItemData,
    {
      id: "mystical-symbol",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.mystical-symbol",
    } as OffHandItemData,
    {
      id: "orcish-blade",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.orcish-blade",
    } as WeaponItemData,
    {
      id: "orcish-cleaver",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.orcish-cleaver",
    } as WeaponItemData,
    {
      id: "orcish-reaper-blade",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy"],
      translation_key: "weapon.core.orcish-reaper-blade",
    } as WeaponItemData,
    {
      id: "pact-blade",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.pact-blade",
    } as OffHandItemData,
    {
      id: "padded-leather-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.padded-leather-armor",
    } as ArmorItemData,
    {
      id: "periapt-of-greater-healing",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.periapt-of-greater-healing",
    } as ItemData,
    {
      id: "periapt-of-healing",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.periapt-of-healing",
    } as ItemData,
    {
      id: "periapt-of-supreme-healing",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.periapt-of-supreme-healing",
    } as ItemData,
    {
      id: "plate-armor",
      itemType: "Armor",
      cardType: "Starting Gear",
      armorTypes: ["Plate"],
      translation_key: "armor.core.plate-armor",
    } as ArmorItemData,
    {
      id: "potion-of-fortitude",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Potion",
      translation_key: "consumable.core.potion-of-fortitude",
    } as ConsumableItemData,
    {
      id: "potion-of-healing",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Potion",
      translation_key: "consumable.core.potion-of-healing",
    } as ConsumableItemData,
    {
      id: "potion-of-preparation",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Potion",
      translation_key: "consumable.core.potion-of-preparation",
    } as ConsumableItemData,
    {
      id: "reinforced-leather-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.reinforced-leather-armor",
    } as ArmorItemData,
    {
      id: "reinforced-shadow-leather",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.reinforced-shadow-leather",
    } as ArmorItemData,
    {
      id: "repeating-crossbow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.repeating-crossbow",
    } as WeaponItemData,
    {
      id: "ring-of-greater-precision",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.ring-of-greater-precision",
    } as ItemData,
    {
      id: "ring-of-legendary-precision",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.ring-of-legendary-precision",
    } as ItemData,
    {
      id: "ring-of-precision",
      itemType: "Trinket",
      cardType: "Camp Item",
      translation_key: "trinket.core.ring-of-precision",
    } as ItemData,
    {
      id: "round-brass-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.round-brass-shield",
    } as OffHandItemData,
    {
      id: "round-golden-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.round-golden-shield",
    } as OffHandItemData,
    {
      id: "round-silver-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.round-silver-shield",
    } as OffHandItemData,
    {
      id: "ruby-brooch",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.ruby-brooch",
    } as ItemData,
    {
      id: "runecarved-blade",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Implement"],
      translation_key: "weapon.core.runecarved-blade",
    } as WeaponItemData,
    {
      id: "runecarved-cloak",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Leather", "Cloth"],
      translation_key: "armor.core.runecarved-cloak",
    } as ArmorItemData,
    {
      id: "runecarved-shield",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Shield", "Relic"],
      translation_key: "offhand.core.runecarved-shield",
    } as OffHandItemData,
    {
      id: "scroll-of-displacement",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Scroll",
      translation_key: "consumable.core.scroll-of-displacement",
    } as ConsumableItemData,
    {
      id: "scroll-of-icy-bolts",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Scroll",
      translation_key: "consumable.core.scroll-of-icy-bolts",
    } as ConsumableItemData,
    {
      id: "scroll-of-incinerate",
      itemType: "Consumable",
      cardType: "Chest",
      consumableType: "Scroll",
      translation_key: "consumable.core.scroll-of-incinerate",
    } as ConsumableItemData,
    {
      id: "scroll-of-unmaking",
      itemType: "Consumable",
      cardType: "Adventure",
      consumableType: "Scroll",
      translation_key: "consumable.core.scroll-of-unmaking",
    } as ConsumableItemData,
    {
      id: "seed-of-darkness-bright",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.seed-of-darkness-bright",
    } as ItemData,
    {
      id: "seed-of-darkness-dim",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.seed-of-darkness-dim",
    } as ItemData,
    {
      id: "shadow-leather-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.shadow-leather-armor",
    } as ArmorItemData,
    {
      id: "sigil-of-honor",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.sigil-of-honor",
    } as OffHandItemData,
    {
      id: "sigil-of-narangerel",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.sigil-of-narangerel",
    } as ItemData,
    {
      id: "spellweave-cloak",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Cloth"],
      translation_key: "armor.core.spellweave-cloak",
    } as ArmorItemData,
    {
      id: "staff-of-gravity",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.desertofhellscar.staff-of-gravity",
    } as WeaponItemData,
    {
      id: "staff-of-the-arcana",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-arcana",
    } as WeaponItemData,
    {
      id: "staff-of-the-dawn",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-dawn",
    } as WeaponItemData,
    {
      id: "staff-of-the-moon",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-moon",
    } as WeaponItemData,
    {
      id: "staff-of-the-noon",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-noon",
    } as WeaponItemData,
    {
      id: "staff-of-the-stars",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-stars",
    } as WeaponItemData,
    {
      id: "staff-of-the-twilight",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-twilight",
    } as WeaponItemData,
    {
      id: "staff-of-the-wildfire-cosmic-gem",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-wildfire-cosmic-gem",
    } as WeaponItemData,
    {
      id: "staff-of-the-wildfire-socketed",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.staff-of-the-wildfire-socketed",
    } as WeaponItemData,
    {
      id: "steel-shield",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Shield"],
      translation_key: "offhand.core.steel-shield",
    } as OffHandItemData,
    {
      id: "studded-leather-armor",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.studded-leather-armor",
    } as ArmorItemData,
    {
      id: "studded-shadow-leather",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather"],
      translation_key: "armor.core.studded-shadow-leather",
    } as ArmorItemData,
    {
      id: "sword-of-the-dynasty",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.sword-of-the-dynasty",
    } as WeaponItemData,
    {
      id: "sword-of-the-prince",
      itemType: "Weapon",
      cardType: "Adventure",
      weaponTypes: ["Light", "Heavy"],
      translation_key: "weapon.core.sword-of-the-prince",
    } as WeaponItemData,
    {
      id: "symbol-of-light",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Relic"],
      translation_key: "offhand.core.symbol-of-light",
    } as OffHandItemData,
    {
      id: "teddy-bear",
      itemType: "Trinket",
      cardType: "Adventure",
      translation_key: "trinket.core.teddy-bear",
    } as ItemData,
    {
      id: "terror-blade",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.terror-blade",
    } as WeaponItemData,
    {
      id: "thornmail",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Plate"],
      translation_key: "armor.core.thornmail",
    } as ArmorItemData,
    {
      id: "throwing-dagger",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.throwing-dagger",
    } as OffHandItemData,
    {
      id: "undermountain-scabbard",
      itemType: "Off Hand",
      cardType: "Adventure",
      offHandTypes: ["Off Hand Weapon", "Shield", "Relic"],
      translation_key: "offhand.core.undermountain-scabbard",
    } as OffHandItemData,
    {
      id: "valaranian-runebow",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Ranged"],
      translation_key: "weapon.core.valaranian-runebow",
    } as WeaponItemData,
    {
      id: "vengeful-pact-blade",
      itemType: "Off Hand",
      cardType: "Camp Item",
      offHandTypes: ["Off Hand Weapon"],
      translation_key: "offhand.core.vengeful-pact-blade",
    } as OffHandItemData,
    {
      id: "vicious-knife",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Light"],
      translation_key: "weapon.core.vicious-knife",
    } as WeaponItemData,
    {
      id: "weapon-of-the-ancients",
      itemType: "Weapon",
      cardType: "Camp Item",
      weaponTypes: ["Heavy", "Light", "Implement", "Ranged"],
      translation_key: "weapon.desertofhellscar.weapon-of-the-ancients",
    } as WeaponItemData,
    {
      id: "wooden-staff",
      itemType: "Weapon",
      cardType: "Starting Gear",
      weaponTypes: ["Implement"],
      translation_key: "weapon.core.wooden-staff",
    } as WeaponItemData,
    {
      id: "wormscale-breastplate",
      itemType: "Armor",
      cardType: "Camp Item",
      armorTypes: ["Leather", "Plate"],
      translation_key: "armor.desertofhellscar.wormscale-breastplate",
    } as ArmorItemData,
    {
      id: "xerethian-breastplate",
      itemType: "Armor",
      cardType: "Adventure",
      armorTypes: ["Leather", "Plate"],
      translation_key: "armor.core.xerethian-breastplate",
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
