import AvatarImageUrl from "@/assets/hero/avatar/NyxAvatar.webp";
export class NyxSwordmage {
    id = "nyx";
    name = "Nyx (Swordmage)";
    content = "awakenings";
    class = "Swordmage";
    path = "Cunning";
    race = "Succubus";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Relic"],
        armor: ["Cloth"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
