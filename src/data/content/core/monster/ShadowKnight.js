import ImageUrl from "@/assets/monster/big/ShadowKnightBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowKnightMiniature.webp";
export class ShadowKnight {
  id = "shadow-knight";
  name = "Shadow Knight";
  content = "core";
  variants = ["standard", "alternate", "complex"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "black";
  translation_key = "monster.shadow-knight";
}
