import ImageUrl from "@/assets/monster/big/DreamTitanBig.webp";
export class DreamTitan {
    id = "dream-titan";
    name = "Dream Titan";
    content = "apocalypse";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "black";
    translation_key = "monster.dream-titan";
}
