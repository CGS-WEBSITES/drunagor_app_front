import ImageUrl from "@/assets/monster/big/ThernBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ThernMiniature.webp";
export class Thern {
    id = "commander-thern";
    name = "Thern";
    content = "spoils-of-war";
    variants = [];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    translation_key = "monster.commander-thern";
}
