import AvatarImageUrl from "@/assets/hero/avatar/DrixxAvatar.webp";
export class Drixx {
  id = "drixx";
  name = "Drixx";
  content = "hero-pack-1";
  class = "Warlord";
  path = "Strength";
  race = "Efreet";
  proficiencies = {
    weapon: ["Light"],
    offHand: ["Off Hand Weapon"],
    armor: ["Leather"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
