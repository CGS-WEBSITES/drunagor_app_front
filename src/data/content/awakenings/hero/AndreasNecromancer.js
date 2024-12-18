import AvatarImageUrl from "@/assets/hero/avatar/AndreasAvatar.webp";
export class AndreasNecromancer {
  id = "andreas";
  name = "Andreas (Necromancer)";
  content = "awakenings";
  class = "Necromancer";
  path = "Devotion";
  race = "Human";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Shield"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
