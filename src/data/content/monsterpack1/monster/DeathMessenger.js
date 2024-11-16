import ImageUrl from "@/assets/monster/big/DeathMessengerBig.webp";
import MiniatureUrl from "@/assets/monster/miniature/DeathMessengerMiniature.webp";
export class DeathMessenger {
  id = "death-messenger";
  name = "Death Messenger";
  content = "monster-pack-1";
  variants = ["standard", "alternate"];
  images = {
    big: ImageUrl,
    miniature: MiniatureUrl,
  };
  color = "gray";
  translation_key = "monster.death-messenger";
}
