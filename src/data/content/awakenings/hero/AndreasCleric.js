import AvatarImageUrl from "@/assets/hero/avatar/AndreasAvatar.webp";
export class AndreasCleric {
  id = "andreas-cleric";
  name = "Andreas (Cleric)";
  content = "awakenings";
  class = "Cleric";
  path = "Devotion";
  race = "Human";
  proficiencies = {
    weapon: ["Light"],
    offHand: ["Shield"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
