import ImageUrl from "@/assets/monster/big/SkeletonKnightBig.webp";
export class SkeletonKnight {
    id = "skeleton-knight";
    name = "Skeleton Knight";
    content = "apocalypse";
    variants = ["standard", "alternate"];
    images = {
        big: ImageUrl,
        miniature: "",
    };
    color = "white";
    translation_key = "monster.skeleton-knight";
}
