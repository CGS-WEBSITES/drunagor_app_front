import AvatarImageUrl from "@/assets/hero/avatar/VacrenAvatar.webp";
export class VacrenWarlord {
  id = "vacren";
  name = "Vacren (Warlord)";
  content = "awakenings";
  class = "Warlord";
  path = "Strength";
  race = "Human";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Off Hand Weapon"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
