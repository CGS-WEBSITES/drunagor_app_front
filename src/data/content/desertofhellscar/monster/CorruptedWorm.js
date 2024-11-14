import ImageUrl from "@/assets/monster/big/CorruptedWormBig.webp";
export class CorruptedWorm {
    id = "corrupted-worm";
    name = "Corrupted Worm";
    content = "desert-of-hellscar";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "gray";
    translation_key = "monster.corrupted-worm";
}
