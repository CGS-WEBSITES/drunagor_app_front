import ImageUrl from "@/assets/monster/big/ExecutionerBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ExecutionerMiniature.webp";
export class Executioner {
    id = "executioner";
    name = "Executioner";
    content = "core";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "gray";
    translation_key = "monster.executioner";
}
