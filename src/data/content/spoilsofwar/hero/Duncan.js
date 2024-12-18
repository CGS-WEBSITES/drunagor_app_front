import AvatarImageUrl from "@/assets/hero/avatar/DuncanAvatar.webp";
export class Duncan {
  id = "duncan";
  name = "Duncan";
  content = "spoils-of-war";
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
