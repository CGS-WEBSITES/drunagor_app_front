import AvatarImageUrl from "@/assets/hero/avatar/MayaAvatar.webp";
export class Maya {
    id = "maya";
    name = "Maya";
    content = "core";
    class = "Ranger";
    path = "Nature";
    race = "Human";
    proficiencies = {
        weapon: ["Ranged"],
        offHand: ["Off Hand Weapon"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
