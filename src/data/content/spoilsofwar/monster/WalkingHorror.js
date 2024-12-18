import ImageUrl from "@/assets/monster/big/WalkingHorrorBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/WalkingHorrorMiniature.webp";
export class WalkingHorror {
  id = "walking-horror";
  name = "Walking Horror";
  content = "spoils-of-war";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "white";
  translation_key = "monster.walking-horror";
}
