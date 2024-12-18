import {
  instanceOfArmorCardData,
  instanceOfOffHandCardData,
  instanceOfWeaponCardData,
} from "@/data/repository/ItemData";
export function heroCanUse(hero, item) {
  if (instanceOfArmorCardData(item)) {
    return item.armorTypes.some((armorType) =>
      hero.proficiencies.armor.some(
        (armorProficiency) => armorProficiency === armorType,
      ),
    );
  }
  if (instanceOfOffHandCardData(item)) {
    return item.offHandTypes.some((offHandType) =>
      hero.proficiencies.offHand.some(
        (offHandProficiency) => offHandProficiency === offHandType,
      ),
    );
  }
  if (instanceOfWeaponCardData(item)) {
    return item.weaponTypes.some((weaponType) =>
      hero.proficiencies.weapon.some(
        (weaponProficiency) => weaponProficiency === weaponType,
      ),
    );
  }
  return true;
}
