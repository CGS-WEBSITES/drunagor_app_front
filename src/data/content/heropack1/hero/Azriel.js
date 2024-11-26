import AvatarImageUrl from "@/assets/hero/avatar/AzrielAvatar.webp";
export class Azriel {
  id = "azriel";
  name = "Azriel";
  content = "hero-pack-1";
  class = "Swordmage";
  path = "Devotion";
  race = "Human";
  proficiencies = {
    weapon: ["Light"],
    offHand: ["Off Hand Weapon"],
    armor: ["Leather"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
