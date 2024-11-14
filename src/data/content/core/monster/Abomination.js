import ImageUrl from "@/assets/monster/big/AbominationBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/AbominationMiniature.webp";
export class Abomination {
    id = "abomination";
    name = "Abomination";
    content = "core";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "black";
    translation_key = "monster.abomination";
}
