import AvatarImageUrl from "@/assets/hero/avatar/NyxAvatar.webp";
export class NyxAssassin {
  id = "nyx-assassin";
  name = "Nyx (Assassin)";
  content = "awakenings";
  class = "Assasin";
  path = "Cunning";
  race = "Succubus";
  proficiencies = {
    weapon: ["Heavy"],
    offHand: ["Off Hand Weapon"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
