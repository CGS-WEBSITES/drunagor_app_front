import AvatarImageUrl from "@/assets/hero/avatar/DrasekAvatar.webp";
export class Drasek {
    id = "drasek";
    name = "Drasek";
    content = "rise-of-the-undead-dragon";
    class = "Paladin";
    path = "Devotion";
    race = "Draconian";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Shield", "Relic"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
