import AvatarImageUrl from "@/assets/hero/avatar/HandurielAvatar.webp";
export class Handuriel {
    id = "handuriel";
    name = "Handuriel";
    content = "handuriel";
    class = "Ranger";
    path = "Nature";
    race = "Elf";
    proficiencies = {
        weapon: ["Ranged"],
        offHand: ["Off Hand Weapon"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
