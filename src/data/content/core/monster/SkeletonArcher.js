import ImageUrl from "@/assets/monster/big/SkeletonArcherBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/SkeletonArcherMiniature.webp";
export class SkeletonArcher {
  id = "skeleton-archer";
  name = "Skeleton Archer";
  content = "core";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.skeleton-archer";
}
