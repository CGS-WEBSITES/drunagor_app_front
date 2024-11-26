import AvatarImageUrl from "@/assets/hero/avatar/ElrosAvatar.webp";
export class Elros {
  id = "elros";
  name = "Elros";
  content = "core";
  class = "Assasin";
  path = "Cunning";
  race = "Elf";
  proficiencies = {
    weapon: ["Light"],
    offHand: ["Off Hand Weapon"],
    armor: ["Leather"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
