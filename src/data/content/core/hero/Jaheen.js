import AvatarImageUrl from "@/assets/hero/avatar/JaheenAvatar.webp";
export class Jaheen {
    id = "jaheen";
    name = "Jaheen";
    content = "core";
    class = "Cleric";
    path = "Devotion";
    race = "Human";
    proficiencies = {
        weapon: ["Light"],
        offHand: ["Shield"],
        armor: ["Plate"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
