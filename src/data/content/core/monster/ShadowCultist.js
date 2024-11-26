import ImageUrl from "@/assets/monster/big/ShadowCultistBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowCultistMiniature.webp";
export class ShadowCultist {
  id = "shadow-cultist";
  name = "Shadow Cultist";
  content = "core";
  variants = ["standard", "alternate", "complex"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.shadow-cultist";
}
