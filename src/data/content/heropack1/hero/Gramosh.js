import AvatarImageUrl from "@/assets/hero/avatar/GramoshAvatar.webp";
export class Gramosh {
  id = "gramosh";
  name = "Gramosh";
  content = "hero-pack-1";
  class = "Shaman";
  path = "Nature";
  race = "Orc";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
