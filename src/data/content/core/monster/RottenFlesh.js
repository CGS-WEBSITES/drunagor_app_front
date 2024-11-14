import ImageUrl from "@/assets/monster/big/RottenFleshBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/RottenFleshMiniature.webp";
export class RottenFlesh {
    id = "rotten-flesh";
    name = "Rotten Flesh";
    content = "core";
    variants = ["standard", "alternate", "complex"];
    images = {
        big: ImageUrl,
        miniature: MiniatureUrl,
    };
    color = "gray";
    translation_key = "monster.rotten-flesh";
}
