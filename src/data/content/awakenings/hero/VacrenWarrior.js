import AvatarImageUrl from "@/assets/hero/avatar/VacrenAvatar.webp";
export class VacrenWarrior {
    id = "vacren-warrior";
    name = "Vacren (Warrior)";
    content = "awakenings";
    class = "Warrior";
    path = "Strength";
    race = "Human";
    proficiencies = {
        weapon: ["Heavy"],
        offHand: ["Relic"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
