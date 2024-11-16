import ImageUrl from "@/assets/monster/big/TwinBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/TwinMiniature.webp";
export class Twin {
  id = "commander-twin";
  name = "Twin";
  content = "spoils-of-war";
  variants = [];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  translation_key = "monster.commander-twin";
}
