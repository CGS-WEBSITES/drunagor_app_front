import AvatarImageUrl from "@/assets/hero/avatar/JadeAvatar.webp";
export class Jade {
  id = "jade";
  name = "Jade";
  content = "rise-of-the-undead-dragon";
  class = "Paladin";
  path = "Devotion";
  race = "Human";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Shield", "Relic"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
