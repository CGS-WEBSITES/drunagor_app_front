import AvatarImageUrl from "@/assets/hero/avatar/SavranAvatar.webp";
export class Savran {
  id = "savran";
  name = "Savran";
  content = "spoils-of-war";
  class = "Druid";
  path = "Nature";
  race = "Human";
  proficiencies = {
    weapon: ["Implement"],
    offHand: ["Relic"],
    armor: ["Cloth"],
  };
  images = {
    avatar: AvatarImageUrl,
  };
}
