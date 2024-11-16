import AvatarImageUrl from "@/assets/hero/avatar/SunAvatar.webp";
export class Sun {
  id = "sun";
  name = "Sun";
  content = "spoils-of-war";
  class = "Monk";
  path = "Cunning";
  race = "Human";
  proficiencies = {
    weapon: ["Light"],
    offHand: ["Off Hand Weapon"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
