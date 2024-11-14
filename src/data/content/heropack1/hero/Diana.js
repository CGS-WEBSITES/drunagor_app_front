import AvatarImageUrl from "@/assets/hero/avatar/DianaAvatar.webp";
export class Diana {
    id = "diana";
    name = "Diana";
    content = "hero-pack-1";
    class = "Swordmage";
    path = "Devotion";
    race = "Valkyrie";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Relic"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
