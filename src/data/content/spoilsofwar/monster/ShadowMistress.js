import ImageUrl from "@/assets/monster/big/ShadowMistressBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/ShadowMistressMiniature.webp";
export class ShadowMistress {
  id = "shadow-mistress";
  name = "Shadow Mistress";
  content = "spoils-of-war";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.shadow-mistress";
}
