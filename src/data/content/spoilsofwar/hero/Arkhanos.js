import AvatarImageUrl from "@/assets/hero/avatar/ArkhanosAvatar.webp";
export class Arkhanos {
    id = "arkhanos";
    name = "Arkhanos";
    content = "spoils-of-war";
    class = "Mage";
    path = "Mystics";
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
