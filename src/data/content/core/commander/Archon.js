import ImageUrl from "@/assets/monster/big/ShadowCultistBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowCultistMiniature.webp";
export class Archon {
    id = "archon";
    name = "Archon";
    content = "core";
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    translation_key = "monster.archon";
}
