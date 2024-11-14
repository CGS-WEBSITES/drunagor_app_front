import AvatarImageUrl from "@/assets/hero/avatar/ShadowAvatar.webp";
export class Shadow {
    id = "shadow";
    name = "Shadow";
    content = "spoils-of-war";
    class = "Assasin";
    path = "Cunning";
    race = "Efreet";
    proficiencies = {
        weapon: ["Light"],
        offHand: ["Off Hand Weapon"],
        armor: ["Leather"],
    };
    images = {
        avatar: AvatarImageUrl,
    };
}
