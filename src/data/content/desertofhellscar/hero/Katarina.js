import AvatarImageUrl from "@/assets/hero/avatar/KatarinaAvatar.webp";
export class Katarina {
    id = "katarina";
    name = "Katarina";
    content = "desert-of-hellscar";
    class = "Barbarian";
    path = "Strength";
    race = "Human";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Off Hand Weapon"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
