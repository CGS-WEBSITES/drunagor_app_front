import ImageUrl from "@/assets/monster/big/NightStalkerBig.webp";
export class NightStalker {
    id = "night-stalker";
    name = "Night Stalker";
    content = "awakenings";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "gray";
    translation_key = "monster.night-stalker";
}
