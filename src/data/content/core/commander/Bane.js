import ImageUrl from "@/assets/monster/big/ShadowVampireBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowVampireMiniature.webp";
export class Bane {
    id = "bane";
    name = "Bane";
    content = "core";
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    translation_key = "monster.bane";
}
