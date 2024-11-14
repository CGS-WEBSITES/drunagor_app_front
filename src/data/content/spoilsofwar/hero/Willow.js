import AvatarImageUrl from "@/assets/hero/avatar/WillowAvatar.webp";
export class Willow {
    id = "Willow";
    name = "Willow";
    content = "spoils-of-war";
    class = "Druid";
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
