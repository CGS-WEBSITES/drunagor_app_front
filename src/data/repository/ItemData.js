export function instanceOfArmorCardData(object) {
    return "armorTypes" in object;
}
export function instanceOfConsumableCardData(object) {
    return "consumableType" in object;
}
export function instanceOfOffHandCardData(object) {
    return "offHandTypes" in object;
}
export function instanceOfWeaponCardData(object) {
    return "weaponTypes" in object;
}
