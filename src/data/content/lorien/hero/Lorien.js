import AvatarImageUrl from "@/assets/hero/avatar/LorienAvatar.webp";
export class Lorien {
  id = "lorien";
  name = "Lorien";
  content = "lorien";
  class = "Mage";
  path = "Mystics";
  race = "Elf";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
