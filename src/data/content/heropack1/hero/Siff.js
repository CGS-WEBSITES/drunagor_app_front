import AvatarImageUrl from "@/assets/hero/avatar/SiffAvatar.webp";
export class Siff {
  id = "siff";
  name = "Siff";
  content = "hero-pack-1";
  class = "Necromancer";
  path = "Mystics";
  race = "Azurean";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Off Hand Weapon"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
