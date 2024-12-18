import AvatarImageUrl from "@/assets/hero/avatar/FlavianAvatar.webp";
export class Flavian {
  id = "flavian";
  name = "Flavian";
  content = "spoils-of-war";
  class = "Bard";
  path = "Nature";
  race = "Halfling";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
