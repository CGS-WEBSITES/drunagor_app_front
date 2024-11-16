import AvatarImageUrl from "@/assets/hero/avatar/VornAvatar.webp";
export class Vorn {
  id = "vorn";
  name = "Vorn";
  content = "core";
  class = "Warrior";
  path = "Strength";
  race = "Dwarf";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Shield"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
