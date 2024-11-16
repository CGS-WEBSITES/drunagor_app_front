import AvatarImageUrl from "@/assets/hero/avatar/LorelaiAvatar.webp";
export class Lorelai {
  id = "lorelai";
  name = "Lorelai";
  content = "core";
  class = "Mage";
  path = "Mystics";
  race = "Elf";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
