import AvatarImageUrl from "@/assets/hero/avatar/MordredAvatar.webp";
export class Mordred {
    id = "mordred";
    name = "Mordred";
    content = "hero-pack-1";
    class = "Necromancer";
    path = "Mystics";
    race = "Human";
    proficiencies = {
        weapon: ["Implement"],
        offHand: ["Relic"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
