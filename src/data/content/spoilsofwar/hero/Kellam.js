import AvatarImageUrl from "@/assets/hero/avatar/KellamAvatar.webp";
export class Kellam {
    id = "kellam";
    name = "Kellam";
    content = "spoils-of-war";
    class = "Bard";
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
