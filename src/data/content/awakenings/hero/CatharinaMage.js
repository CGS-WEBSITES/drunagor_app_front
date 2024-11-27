import AvatarImageUrl from "@/assets/hero/avatar/CatharinaAvatar.webp";
export class CatharinaMage {
  id = "catharina-mage";
  name = "Catharina (Mage)";
  content = "awakenings";
  class = "Mage";
  path = "Mystics";
  race = "Human";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
