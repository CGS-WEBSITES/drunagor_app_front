import ImageUrl from "@/assets/monster/big/ScoutOfDarknessBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ScoutOfDarknessMiniature.webp";
export class ScoutOfDarkness {
  id = "scout-of-darkness";
  name = "Scout Of Darkness";
  content = "monster-pack-1";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.scout-of-darkness";
}
