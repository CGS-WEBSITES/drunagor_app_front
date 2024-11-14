import ImageUrl from "@/assets/monster/big/LadyClawBig.webp";
export class LadyClaw {
    id = "lady-claw";
    name = "Lady Claw";
    content = "the-ruin-of-luccanor";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "gray";
    translation_key = "monster.lady-claw";
}
