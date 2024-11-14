import ImageUrl from "@/assets/monster/big/ShadowVampireBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowVampireMiniature.webp";
export class ShadowVampire {
    id = "shadow-vampire";
    name = "Shadow Vampire";
    content = "core";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "gray";
    translation_key = "monster.shadow-vampire";
}
