import AvatarImageUrl from "@/assets/hero/avatar/PietroAvatar.webp";
export class Pietro {
  id = "pietro";
  name = "Pietro";
  content = "spoils-of-war";
  class = "Cleric";
  path = "Devotion";
  race = "Human";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Plate"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
