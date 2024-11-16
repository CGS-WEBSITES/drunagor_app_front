import AvatarImageUrl from "@/assets/hero/avatar/BrihitteAvatar.webp";
export class Brihitte {
  id = "brihitte";
  name = "Brihitte";
  content = "hero-pack-1";
  class = "Warlord";
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
