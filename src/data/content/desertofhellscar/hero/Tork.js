import AvatarImageUrl from "@/assets/hero/avatar/TorkAvatar.webp";
export class Tork {
    id = "tork";
    name = "Tork";
    content = "desert-of-hellscar";
    class = "Barbarian";
    path = "Strength";
    race = "Orc";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Off Hand Weapon"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
