import AvatarImageUrl from "@/assets/hero/avatar/DevronAvatar.webp";
export class Devron {
    id = "devron";
    name = "Devron";
    content = "spoils-of-war";
    class = "Shadow knight";
    path = "Strength";
    race = "Vampire";
    proficiencies = {
        weapon: ["Light"],
        offHand: ["Off Hand Weapon"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
