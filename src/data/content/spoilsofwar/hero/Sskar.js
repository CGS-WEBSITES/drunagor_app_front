import AvatarImageUrl from "@/assets/hero/avatar/SskarAvatar.webp";
export class Sskar {
  id = "sskar";
  name = "Sskar";
  content = "spoils-of-war";
  class = "Sorcerer";
  path = "Mystics";
  race = "Draconian";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Off Hand Weapon"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
