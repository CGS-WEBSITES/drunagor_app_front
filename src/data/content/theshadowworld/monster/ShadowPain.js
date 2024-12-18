import ImageUrl from "@/assets/monster/big/ShadowPainBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowPainMiniature.webp";
export class ShadowPain {
  id = "shadow-pain";
  name = "Shadow Pain";
  content = "the-shadow-world";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.shadow-pain";
}
