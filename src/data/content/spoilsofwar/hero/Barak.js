import AvatarImageUrl from "@/assets/hero/avatar/BarakAvatar.webp";
export class Barak {
    id = "barak";
    name = "Barak";
    content = "spoils-of-war";
    class = "Sorcerer";
    path = "Mystics";
    race = "Orc";
    proficiencies = {
        weapon: ["Implement"],
        offHand: ["Off Hand Weapon"],
        armor: ["Cloth"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
