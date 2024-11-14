import AvatarImageUrl from "@/assets/hero/avatar/CatharinaAvatar.webp";
export class CatharinaShaman {
    id = "catharina";
    name = "Catharina (Shaman)";
    content = "awakenings";
    class = "Shaman";
    path = "Mystics";
    race = "Human";
    proficiencies = {
        weapon: ["Implement"],
        offHand: ["Off Hand Weapon"],
        armor: ["Cloth"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
