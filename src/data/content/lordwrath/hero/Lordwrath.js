import AvatarImageUrl from "@/assets/hero/avatar/LordwrathAvatar.webp";
export class Lordwrath {
    id = "lordwrath";
    name = "Lordwrath";
    content = "lordwrath";
    class = "Shadow knight";
    path = "Strength";
    race = "Human";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Off Hand Weapon"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
